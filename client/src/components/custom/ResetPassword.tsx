import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Check,
  Mail,
  RefreshCw,
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { useForm, useWatch } from "react-hook-form";

interface IResetPass extends IOpenChange {}

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPassword = (props: IResetPass) => {
  const { ...rest } = props;
  const [time, setTime] = useState<number>(30); // timeer
  const [emailSent, setEmailSent] = useState<boolean>(true); // state for checking if the email has already been sent
  const {
    register,
    control,
    //  handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Pick<BaseInfo, "emailAddress">>({
    mode: "onChange",
  });

  const { emailAddress } = useWatch<Pick<BaseInfo, "emailAddress">>({
    control,
  });

  const valid = useMemo(() => {
    if (!emailAddress?.length) {
      return false;
    } // return false if no value from fields, this will get converted to true and will disable the login button

    return emailAddress?.length > 0; // check if both field is higher than zero, allowing them to submit the form
  }, [emailAddress]);

  useEffect(() => {
    if (!emailSent) return;
    if (time <= 0) return;

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [emailSent, time]);

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[26rem] px-0">
        <form className="px-6 flex flex-col gap-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>
              {emailSent ? "Check your email" : "Forgot Password?"}
            </DialogTitle>
            <DialogDescription>
              {emailSent ? (
                <span className="[&_span]:font-medium">
                  We sent a password reset link to <span>{emailAddress}</span>. The link expires in <span>5 minutes</span>.
                </span>
              ) : (
                "Enter your registered email address and we'll send you a secure reset link."
              )}
            </DialogDescription>
          </DialogHeader>
          {!emailSent && (
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
          )}
          {emailSent && (
            <div className="w-full relative flex flex-col rounded-lg px-4 py-3 border gap-y-1 gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
              <span className="text-gray-500 dark:text-grat-800 text-xs">
                {time === 0 ? "READY TO SEND" : "RESEND AVAILABLE IN"}
              </span>
              <span className="text-sm">
                {time === 0
                  ? "You can now request a new link"
                  : "Wait a moment...."}
              </span>
              <span className="absolute right-7 bottom-5 text-gray-500 dark:text-gray-300 font-medium">
                {time === 0 ? (
                  <CheckCircle size={20} className="text-emerald-500" />
                ) : (
                  time
                )}
              </span>
            </div>
          )}
          {(emailSent && time === 0) || !emailSent ? (
            <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end mt-1">
              <Button
                variant={!emailSent ? "default" : "outline"}
                disabled={(!emailSent && !valid) || isSubmitting}
                className={cn("flex-1", emailSent && "h-11")}
                type="submit"
              >
                {isSubmitting && <RefreshCw className="animate-spin" />}
                {isSubmitting ? (
                  "Please wait..."
                ) : emailSent ? (
                  <span className="flex gap-x-2 items-center">
                    Resend email link <ArrowRight />
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </DialogFooter>
          ) : null}
          {emailSent && (
            <div className="w-full flex flex-col text-sm rounded-lg px-4 py-3 border border-amber-400 dark:border-amber-800 gap-y-1 gap-x-2 bg-amber-100/50 dark:bg-amber-900/70">
              <span className="text-amber-700 dark:text-amber-300">
                Didn't receive it? Check your{" "}
                <span className="font-medium">spam or junk folder</span>, or
                contact your system administrator.
              </span>
            </div>
          )}
          <div className="text-xs flex flex-col text-center text-gray-500">
            <span>SJDM City Police Station · Logistics Department</span>
            <span>Authorized personnel only.</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
