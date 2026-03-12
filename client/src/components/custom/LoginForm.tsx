import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { LockIcon, Mail, RefreshCcw, X } from "lucide-react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { CustomToast } from "@/components/custom/CustomToast";
import PageLogo from "./PageLogo";
import ResetPassword from "./ResetPassword";
import FormFooter from "./FormFooter";

interface ILogin {
  emailAddress: string;
  password: string;
}

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SITE_KEY = import.meta.env?.VITE_SITE_KEY;

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [openForgotPass, setOpenForgotPass] = useState<boolean>(false);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ILogin>({
    mode: "onChange",
  });

  const { emailAddress, password } = useWatch<ILogin>({
    control,
  }); // watch/track the field

  const valid = useMemo(() => {
    if (!emailAddress?.length || !password?.length) {
      return false;
    } // return false if no value from fields, this will get converted to true and will disable the login button

    return emailAddress?.length > 0 || password?.length > 0; // check if both field is higher than zero, allowing them to submit the form
  }, [emailAddress, password]);

  const onSetToken = useCallback((t: string) => {
    setToken(t);
  }, []);

  const onRemoveToken = useCallback(() => setToken(null), []);

  const onOpenForgotPass = useCallback(() => {
    setOpenForgotPass(true);
  }, []);

  const onSubmitForm: SubmitHandler<ILogin> = useCallback(
    async (data) => {
      try {
        if (!valid) {
          throw new Error("Invalid fields");
        } // check if valid fields

        if (!token) {
          throw new Error("No token found");
        } // check token

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error("Internal server error");
        }

        const result = await response.json();
        if (result?.incorrectPass) {
          return CustomToast({
            description: "Incorrect email or password",
            status: "error",
          }); // if incorrect pass show toast displaying incorrect credentials
        }

        navigate("/app/overview/dashboard"); // navigate to private page
      } catch (error) {
        console.log(error);
        CustomToast({
          description: "Internal server error. Please try again",
          status: "error",
        });
      } finally {
        setToken(null); // reset token to null
        turnstileRef?.current?.reset(); // reset the turnstile
      }
    },
    [valid, token, turnstileRef],
  );
  return (
    <Fragment>
      <ResetPassword open={openForgotPass} onOpenChange={setOpenForgotPass} />
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-start gap-2">
          <PageLogo />
          <h1 className="text-2xl font-bold mt-6">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>
        <div className="grid gap-3">
          <div className="space-y-2">
            <Label
              htmlFor="emailAddress"
              className={cn(
                !!errors.emailAddress && "text-red-500 dark:text-red-300",
              )}
            >
              Email Address
            </Label>
            <CustomInput
              icon={Mail}
              id="emailAddress"
              isError={!!errors.emailAddress}
              placeholder="Enter email address"
              {...register("emailAddress", {
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.emailAddress && (
              <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-300">
                <X size={16} />
                {errors.emailAddress.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <CustomInput
              icon={LockIcon}
              id="password"
              isPassword={true}
              placeholder="Enter Password"
              {...register("password")}
              className="h-11"
            />
          </div>
          <Button
            variant="ghost"
            type="button"
            onClick={onOpenForgotPass}
            className="ml-auto text-sm underline-offset-4 hover:underline mb-3 mt-1 text-gray-400 p-0 hover:bg-transparent"
          >
            Forgot your password?
          </Button>
          <Turnstile
            ref={turnstileRef}
            siteKey={SITE_KEY}
            onSuccess={onSetToken} // called when verification passes
            onError={onRemoveToken} // called on error
            onExpire={onRemoveToken} // token expires after ~5 min
            options={{
              theme: "light", // "light" | "dark" | "auto"
              size: "flexible",
            }}
            className="w-full"
          />
          <Button
            type="submit"
            className="w-full h-11 rounded-lg disabled:cursor-not-allowed my-3"
            disabled={!valid || !token || isSubmitting || !!errors.emailAddress}
          >
            {isSubmitting && <RefreshCcw className="animate-spin" />}
            {isSubmitting ? "Please wait..." : "Login"}
          </Button>
          <FormFooter />
        </div>
      </form>
    </Fragment>
  );
}
