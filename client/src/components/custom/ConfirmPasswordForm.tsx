import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { Check, LockIcon, RefreshCcw, X } from "lucide-react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import PageLogo from "@/components/custom/PageLogo";
import FormFooter from "@/components/custom/FormFooter";
import { useNavigate, useParams } from "react-router-dom";
import LinkExpired from "./LinkExpired";
import { CustomToast } from "./CustomToast";
import { useQuery } from "@tanstack/react-query";
import VerifyEmailCode from "@/services/verifyEmailCode";
import ConfirmPassSkeleton from "./ConfirmPassSkeleton";

interface IConfirmPass {
  newPassword: string;
  confirmPassword: string;
}

const PASSWORD_REGEX: RegExp =
  /^(?=.*\d)(?=[^!@#$%^&*]*[!@#$%^&*][^!@#$%^&*]*$)[A-Za-z\d!@#$%^&*]{5,15}$/; // requires especial character, and number

export default function ConfirmPassForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const { code } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["verify-token", code],
    queryFn: () => VerifyEmailCode(code?.toString() as string),
    enabled: !!code,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const [isInvalidLink, setIsInvalidLink] = useState<boolean>(false); // state for invalid link
  const [isUpdated, setIsUpdated] = useState<boolean>(false); // state to check if the password has been updated already
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IConfirmPass>({
    mode: "onChange",
  });

  const { newPassword, confirmPassword } = useWatch<IConfirmPass>({
    control,
  }); // watch/track the field

  const isError = useMemo(() => {
    if (!newPassword || !confirmPassword) return false; // Don't have to validate yet
    return newPassword !== confirmPassword;
  }, [newPassword, confirmPassword]);

  const valid = useMemo(() => {
    if (!newPassword?.length || !confirmPassword?.length) {
      return false;
    } // return false if no value from fields, this will get converted to true and will disable the login button

    return newPassword?.length > 0 || confirmPassword?.length > 0; // check if both field is higher than zero, allowing them to submit the form
  }, [newPassword, confirmPassword]);

  const onGoBackLogin = useCallback(
    () =>
      navigate("/auth/login", {
        replace: true,
      }),
    [navigate],
  );

  useEffect(() => {
    if ((!code || error) && !isLoading && !data?.success) {
      console.log(error);
      // show invalid link display when the code is missing
      setIsInvalidLink(true);
    }
  }, [code, error, isLoading, data]);

  const onSubmitResetPass: SubmitHandler<IConfirmPass> = useCallback(
    async (data) => {
      try {
        if (isInvalidLink) {
          return CustomToast({
            description: "The provided code is invalid",
            status: "error",
          }); // double check if invalid link
        }

        const response = await fetch("/api/auth/update/new-password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            ...data,
          }),
        }); // query to update

        if (!response.ok) {
          return setIsInvalidLink(true); // check response status
        }

        const result = await response.json();
        if (result?.codeError) {
          return setIsInvalidLink(true);
        } // show a display to indicate the code errors

        if (result?.incorrectPass) {
          return CustomToast({
            description: "Password do not match",
            status: "error",
          }); // double check if incorrect pass
        }

        setIsUpdated(true); // set to true if no error
      } catch (err) {
        console.log(err);
        CustomToast({
          description: "Internal server error. Please check your connection",
          status: "error",
        });
      }
    },
    [isInvalidLink, code],
  );

  if (isLoading) {
    return <ConfirmPassSkeleton />;
  }

  return (
    <Fragment>
      <div className="flex flex-col gap-6">
        {isInvalidLink && !isLoading && <LinkExpired />}
      </div>
      <form
        onSubmit={handleSubmit(onSubmitResetPass)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        {isUpdated && !isInvalidLink && !isLoading && (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="p-3 dark:border rounded-full dark:border-emerald-800 bg-emerald-200/50 dark:bg-emerald-950/80">
              <Check
                size={20}
                className="text-emerald-500 dark:text-emerald-300"
              />
            </div>
            <h1 className="text-2xl font-bold mt-5">Password updated</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Your password has been changed successfully. You can now log in
              with your new credentials.
            </p>
            <Button
              type="submit"
              onClick={onGoBackLogin}
              className="w-full h-11 rounded-lg disabled:cursor-not-allowed my-3"
            >
              Back to login
            </Button>
            <FormFooter />
          </div>
        )}
        {!isUpdated && !isInvalidLink && !isLoading && (
          <Fragment>
            <div className="flex flex-col items-start gap-2">
              <PageLogo />
              <h1 className="text-2xl font-bold mt-6">Set new password</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Your identity has been verified. Choose a strong new password
                for your account.
              </p>
            </div>
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label
                  htmlFor="newPassword"
                  className={cn(
                    (!!errors.newPassword || isError) &&
                      "text-red-500 dark:text-red-300",
                  )}
                >
                  New Password
                </Label>
                <CustomInput
                  icon={LockIcon}
                  id="newPassword"
                  isPassword={true}
                  placeholder="Enter new password"
                  isError={isError || !!errors.newPassword}
                  {...register("newPassword", {
                    required: "Password is required",
                    pattern: {
                      value: PASSWORD_REGEX,
                      message:
                        "Password requires letters, numbers, and special character",
                    },
                    minLength: {
                      value: 8,
                      message: "Passsword must be at least 8 characters",
                    },
                  })}
                  className="h-11"
                />
                {errors.newPassword && (
                  <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-300">
                    <X size={16} />
                    {errors.newPassword.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className={cn(
                    (!!errors.confirmPassword || isError) &&
                      "text-red-500 dark:text-red-300",
                  )}
                >
                  Confirm Password
                </Label>
                <CustomInput
                  icon={LockIcon}
                  id="confirmPassword"
                  isPassword={true}
                  placeholder="Re-enter new password"
                  isError={isError || !!errors.confirmPassword}
                  {...register("confirmPassword", {
                    required: "Password is required",
                    pattern: {
                      value: PASSWORD_REGEX,
                      message:
                        "Password requires letters, numbers, and special character",
                    },
                    minLength: {
                      value: 8,
                      message: "Passsword must be at least 8 characters",
                    },
                  })}
                  className="h-11"
                />
                {errors.confirmPassword || isError ? (
                  <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-300">
                    <X size={16} />
                    {isError
                      ? "Passwords do not match"
                      : errors.confirmPassword?.message}
                  </span>
                ) : null}
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-lg disabled:cursor-not-allowed my-3"
                disabled={!valid || isSubmitting || isError}
              >
                {isSubmitting && <RefreshCcw className="animate-spin" />}
                {isSubmitting ? "Please wait..." : "Update Password"}
              </Button>
              <FormFooter />
            </div>
          </Fragment>
        )}
      </form>
    </Fragment>
  );
}
