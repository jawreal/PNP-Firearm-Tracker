import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { LockIcon, Mail, RefreshCcw, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/custom/CustomInput";
import { cn } from "@/lib/utils";
import useAuthStore from "@/hooks/useAuthStore";
import FormatDate from "@/lib/dateFormatter";
import { format } from "date-fns";
import { CustomToast } from "@/components/custom/CustomToast";
import { useQueryClient } from "@tanstack/react-query";

interface IUpdateAccount {
  emailAddress: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX: RegExp =
  /^(?=.*\d)(?=[^!@#$%^&*]*[!@#$%^&*][^!@#$%^&*]*$)[A-Za-z\d!@#$%^&*]{5,15}$/; // requires especial character, and number

const UpdateProfile = (props: IOpenChange) => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<IUpdateAccount>({
    mode: "onChange",
  });

  const accountCreated = useMemo(() => {
    if (user?.createdAt) {
      const date = FormatDate(user?.createdAt);
      if (!date) {
        return "No date found";
      }

      return format(date, "MMM d, yyyy");
    }
  }, [user]); // format account created

  const { newPassword, confirmPassword, oldPassword, emailAddress } =
    useWatch<IUpdateAccount>({
      control,
    }); // watch/track the field

  const isError = useMemo(() => {
    if (!newPassword || !confirmPassword) return false; // Don't have to validate yet
    return newPassword !== confirmPassword;
  }, [newPassword, confirmPassword]); // check if new pass and confirm pass are not equal

  const passwordChange = useMemo(() => {
    if (!confirmPassword || !newPassword || !oldPassword) {
      return false;
    } // check if these fields exists to avoid type error

    return (
      oldPassword?.trim()?.length > 0 &&
      newPassword?.trim()?.length > 0 &&
      confirmPassword?.trim()?.length > 0
    ); // will return true if all of these fields contain characters
  }, [confirmPassword, newPassword, oldPassword]);

  const emailChange = useMemo(() => {
    // this would check if the email hasn't changed
    if (!emailAddress) {
      return false;
    }
    return emailAddress === user?.emailAddress;
  }, [user, emailAddress]);

  const onSubmitChanges: SubmitHandler<IUpdateAccount> = useCallback(
    async (data) => {
      try {
        if (!data) {
          throw new Error("Missing data");
        }

        const normalizedData = {
          admin_id: user?._id,
          ...(!emailChange ? { emailAddress: data?.emailAddress } : {}), // if email changes, send it
          ...(passwordChange
            ? {
                oldPassword: data?.oldPassword,
                newPassword: data?.newPassword,
                confirmPassword: data?.confirmPassword,
              }
            : {}), // if password fields change, send them
        };

        const response = await fetch("/api/admin/update/account", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(normalizedData),
        });
        if (response.status === 403) {
          const result = await response.json();
          if (result?.incorrectPass) {
            return CustomToast({
              description: "The old password you entered is incorrect.",
              status: "error",
            });
          } // show a toast if the old password that's been entered isncorrect
        }

        if (!response.ok) {
          throw new Error("Failed to send update the user info");
        }

        if (user?.emailAddress !== data?.emailAddress) {
          setUser({
            ...user,
            emailAddress: data?.emailAddress,
          }); // update the user session
        }

        queryClient.invalidateQueries({
          queryKey: ["admin-records"],
        }); // invalidate the admin table so it'd refresh its data
        CustomToast({
          description: "Account has been updated",
          status: "success",
        });
        reset(); // reset the form
        closeRef?.current?.click(); // close the form
      } catch (err) {
        console.error(err);
        CustomToast({
          description: "Failed to update user info",
          status: "error",
        });
      }
    },
    [user, reset, closeRef, setUser, queryClient, emailChange, passwordChange],
  );

  useEffect(() => {
    if (user?.emailAddress) {
      reset({
        emailAddress: user?.emailAddress,
      });
    } // set the email address value of user session in emailAddress field
  }, [user]);

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[27rem] md:rounded-lg px-0">
        <form onSubmit={handleSubmit(onSubmitChanges)}>
          <DialogHeader className="text-left px-6 mb-4">
            <DialogTitle>Update Your Account Details</DialogTitle>
            <DialogDescription>
              Please review and update your account information to keep it
              accurate and up to date.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full mb-3 text-sm flex px-6 py-3 border-y items-center gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${user?.fullName ?? "Uknown"}`}
              className="w-7 h-7 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium capitalize">
                {user?.fullName ?? "User not found"}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                {accountCreated ?? "No date found"}
              </span>
            </div>
            <div className="ml-auto flex gap-x-2 items-center text-emerald-600 dark:text-emerald-500 capitalize">
              <span className="w-2 h-2 block rounded-full bg-emerald-500 dark:bg-emerald-600"></span>
              {user?.role ?? "No role found"}
            </div>
          </div>
          <div className="grid gap-3 px-6">
            <div className="space-y-2">
              <Label
                htmlFor="emailAddress"
                className={cn(
                  !!errors.emailAddress && "text-red-500 dark:text-red-400",
                )}
              >
                Email Address
              </Label>
              <CustomInput
                icon={Mail}
                id="emailAddress"
                isError={!!errors.emailAddress}
                placeholder="Email address"
                {...register("emailAddress", {
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Invalid email format",
                  },
                })}
              />
              {errors.emailAddress && (
                <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-400">
                  <X size={16} />
                  {errors.emailAddress.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="oldPassword"
                className={cn(
                  (!!errors.oldPassword || isError) &&
                    "text-red-500 dark:text-red-400",
                )}
              >
                Old Password
              </Label>
              <CustomInput
                icon={LockIcon}
                id="oldPassword"
                isPassword={true}
                placeholder="Enter old password"
                isError={isError || !!errors.oldPassword}
                {...register("oldPassword", {
                  ...(confirmPassword && confirmPassword?.trim()?.length > 0
                    ? {
                        required:
                          "Password fields are required when updating your password, including confirmation.",
                      }
                    : {}),
                })}
                className="h-11"
              />
              {errors.oldPassword && (
                <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-400">
                  <X size={16} />
                  {errors.oldPassword.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className={cn(
                  (!!errors.newPassword || isError) &&
                    "text-red-500 dark:text-red-400",
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
                  ...(passwordChange
                    ? {
                        required:
                          "Password fields are required when updating your password, including confirmation.",
                      }
                    : {}),
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
                <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-400">
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
                    "text-red-500 dark:text-red-400",
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
                  ...(passwordChange
                    ? {
                        required:
                          "Password fields are required when updating your password, including confirmation.",
                      }
                    : {}),
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
                <span className="flex gap-x-1 text-xs text-red-500 dark:text-red-400">
                  <X size={16} />
                  {isError
                    ? "Passwords do not match"
                    : errors.confirmPassword?.message}
                </span>
              ) : null}
            </div>
          </div>
          <DialogFooter className="w-full flex-row gap-x-2 md:gap-x-0 mt-5 px-6">
            <DialogClose asChild className="w-full">
              <Button variant="outline" ref={closeRef} className="w-full">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full rounded-lg disabled:cursor-not-allowed"
              disabled={
                isSubmitting || isError || (emailChange && !passwordChange)
              }
            >
              {isSubmitting && <RefreshCcw className="animate-spin" />}
              {isSubmitting ? "Please wait..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
