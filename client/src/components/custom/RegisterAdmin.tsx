import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ProcessFireArm } from "@/services/processFireArm";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { AtSign, LockIcon, RefreshCcw, User, X } from "lucide-react";
import CustomInput from "@/components/custom/CustomInput";
import { useMemo } from "react";
import ProcessAdminRegistry from "@/services/registerAdmin";

const NAME_REGEX: RegExp = /^[A-Za-z]+(?: [A-Za-z]+)?$/; // regex for checking non alphabets for name
const PASSWORD_REGEX: RegExp =
  /^(?=.*\d)(?=[^!@#$%^&*]*[!@#$%^&*][^!@#$%^&*]*$)[A-Za-z\d!@#$%^&*]{5,15}$/; // requires especial character, and number

const RegisterAdmin = (props: IOpenChange) => {
  const { open, onOpenChange } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = useForm<IRegisterAdmin>({
    mode: "onChange", // needed for onChange validation so error message would appear
  });

  const onSubmit: SubmitHandler<IRegisterAdmin> = React.useCallback(
    async (data) => {
      await ProcessAdminRegistry({
        description: "Added by super-admin **@jd_123**", // only for testing
        ...data,
      });
      reset(); // reset the whole registration field
      onOpenChange(false); // close the dialog
    },
    [ProcessFireArm],
  );

  React.useEffect(() => {
    reset({
      firstName: "", // Clear the form fields
      lastName: "",
      userName: "",
      password: "",
      confirmPassword: "",
    });
  }, [reset]);

  const [password, confirmPassword] = useWatch({
    control,
    name: ["password", "confirmPassword"],
  });

  const isError = useMemo(() => {
    if (!password || !confirmPassword) return false; // Don't have to validate yet
    return password !== confirmPassword;
  }, [password, confirmPassword]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] md:min-w-[28rem] md:max-w-[28rem] rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <DialogTitle>Register Admin</DialogTitle>
            <DialogDescription>
              Kindly complete the required fields when registering an admin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-3 [&_label]:text-sm mt-4 mb-5 [&_span]:text-red-500  [&_span]:text-xs [&_label]:text-gray-700 dark:[&_label]:text-gray-300">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span>*</span>
                </Label>
                <CustomInput
                  icon={User}
                  id="firstName"
                  placeholder="First name"
                  isError={!!errors.firstName}
                  {...register("firstName", {
                    required: "First name is required", // set to boolean if you don't want to specify error
                    pattern: {
                      value: NAME_REGEX,
                      message: "Only letters are allowed",
                    },
                  })}
                />
                {errors.firstName && (
                  <span className="flex gap-x-1">
                    <X size={16} />
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span>*</span>
                </Label>
                <CustomInput
                  icon={User}
                  id="lastName"
                  placeholder="Last name"
                  isError={!!errors.firstName}
                  {...register("lastName", {
                    required: "Last name is required",
                    pattern: {
                      value: NAME_REGEX,
                      message: "Only letters are allowed",
                    },
                  })}
                />
                {errors.lastName && (
                  <span className="flex gap-x-1">
                    <X size={16} />
                    {errors.lastName.message}
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">
                Username <span>*</span>
              </Label>
              <CustomInput
                icon={AtSign}
                id="userName"
                isError={!!errors.userName}
                placeholder="Create username"
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 8,
                    message: "Username must be at least 8 characters",
                  },
                })}
              />
              {errors.userName && (
                <span className="flex gap-x-1">
                  <X size={16} />
                  {errors.userName.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span>*</span>
              </Label>
              <CustomInput
                icon={LockIcon}
                id="password"
                isPassword={true}
                placeholder="Create Password"
                isError={isError || !!errors.password}
                {...register("password", {
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
              {errors.password && (
                <span className="flex gap-x-1">
                  <X size={16} />
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span>*</span>
              </Label>
              <CustomInput
                icon={LockIcon}
                id="confirmPassword"
                isPassword={true}
                isError={isError || !!errors.confirmPassword}
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
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
              />
              <div className="flex flex-col [&_span]:flex [&_span]:gap-x-1">
                {isError && (
                  <span>
                    <X size={16} />
                    Passwords don't match
                  </span>
                )}
                {errors.confirmPassword && (
                  <span>
                    <X size={16} />
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end">
            <DialogClose asChild className="flex-1">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && <RefreshCcw className="animate-spin" />}
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterAdmin;
