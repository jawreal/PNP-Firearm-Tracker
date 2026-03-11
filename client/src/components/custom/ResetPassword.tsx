import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { useForm, useWatch } from "react-hook-form";

interface IResetPass extends IOpenChange {}

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPassword = (props: IResetPass) => {
  const { ...rest } = props;
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

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[26rem] px-0">
        <form className="px-6 flex flex-col gap-y-4">
          <DialogHeader className="text-left">
            <DialogTitle>Forgot Password?</DialogTitle>
            <DialogDescription>
              Enter your registered email address and we'll send you a secure
              reset link.
            </DialogDescription>
          </DialogHeader>
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
          <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end mt-1">
            <Button
              disabled={!valid || isSubmitting}
              className="flex-1"
              type="submit"
            >
              {isSubmitting && <RefreshCw className="animate-spin" />}
              {isSubmitting ? "Please wait..." : "Send reset link"}
            </Button>
          </DialogFooter>
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
