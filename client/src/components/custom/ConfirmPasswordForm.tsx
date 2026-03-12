import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { LockIcon, RefreshCcw, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import PageLogo from "./PageLogo";

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
  const {
    register,
    control,
    // handleSubmit,
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

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-start gap-2">
        <PageLogo />
        <h1 className="text-2xl font-bold mt-6">Set new password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Your identity has been verified. Choose a strong new password for your
          account.
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
                ? "New password and confirm password must be equal"
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
        <Separator className="bg-gray-300 dark:bg-gray-400" />
        <div className="flex text-xs text-gray-400 flex-col pt-1">
          <span>
            San Jose Del Monte City Police Station · Logistics Department
          </span>
          <span>
            Authorized personnel only. All access is monitored and logged.
          </span>
        </div>
      </div>
    </form>
  );
}
