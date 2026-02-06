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
import { useForm, type SubmitHandler } from "react-hook-form";
import { AtSign, LockIcon, RefreshCcw, User } from "lucide-react";
import CustomInput from "@/components/custom/CustomInput";

const RegisterAdmin = (props: IOpenChange) => {
  const { open, onOpenChange } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IRegisterAdmin>();

  const onSubmit: SubmitHandler<IRegisterAdmin> =
    React.useCallback(async () => {
      // reset();
      // onOpenChange(false);
    }, [ProcessFireArm]);

  React.useEffect(() => {
    reset({
      firstName: "", // Clear the form fields
      lastName: "",
      userName: "",
      password: "",
    });
  }, [reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-w-lg rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <DialogTitle>Register Admin</DialogTitle>
            <DialogDescription>
              Kindly complete the required fields when registering an admin.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 [&_label]:text-sm mt-4 mb-5 [&_span]:text-red-500 [&_label]:text-gray-700 dark:[&_label]:text-gray-300">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span>*</span>
                </Label>
                <CustomInput
                  icon={User}
                  id="firstName"
                  placeholder="Enter first name"
                  {...register("firstName", {
                    required: true,
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span>*</span>
                </Label>
                <CustomInput
                  icon={User}
                  id="lastName"
                  placeholder="Enter last name"
                  {...register("lastName", {
                    required: true,
                  })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userName">
                Username <span>*</span>
              </Label>
              <CustomInput
                icon={AtSign}
                id="userName"
                placeholder="Create username"
                {...register("userName", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span>*</span>
              </Label>
              <CustomInput
                icon={LockIcon}
                id="password"
                isPassword={true}
                placeholder="••••••••••"
                {...(register("password"),
                {
                  required: true,
                })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password <span>*</span>
              </Label>
              <CustomInput
                icon={LockIcon}
                id="confirmPassword"
                isPassword={true}
                placeholder="••••••••••"
                {...register("confirmPassword", {
                  required: true,
                })}
                className="h-11"
              />
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
