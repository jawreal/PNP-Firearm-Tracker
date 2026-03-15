import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import ProcessStatus from "@/services/processAdminStat";
import { RefreshCcw, UserRoundCheck, UserRoundX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CustomToast } from "./CustomToast";

interface IProps extends IOpenChange {
  user: IAdminUsers;
}

type IDecision = "active" | "deactivated";

const REASONS: string[] = [
  "The admin will gain access to the system",
  "The admin can view and manage records",
  "The admin will be able to add other admins",
];

const DeactivateAccDialog = (props: IProps) => {
  const { user, ...rest } = props;
  const queryClient = useQueryClient();
  const [decision, setDecision] = useState<IDecision | "empty">("empty"); // for disp
  const [prevReason, setPrevReason] = useState<string>(""); // for storing previous deactivation reason
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const isActive = useMemo(() => user?.status === "active", [user?.status]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<{ deactivationReason: string }>({
    mode: "onChange",
  });

  const deactivationReason = useWatch({
    control,
    name: "deactivationReason",
  });

  const fullName = useMemo(() => {
    if (!user?.firstName || !user?.lastName) {
      return null;
    }

    return `${user.firstName} ${user.lastName}`;
  }, [user]);

  const OPEN_DECISION_AND_NOT_ACTIVE = useMemo(
    () => decision !== "empty" && !isActive,
    [decision, isActive],
  );

  const REASON_CHANGE = useMemo(
    () => deactivationReason?.trim() !== prevReason?.trim(),
    [deactivationReason, prevReason],
  );

  const Icon = useMemo(() => {
    return !isActive ? UserRoundCheck : UserRoundX;
  }, [isActive]);

  const onProcessStat: SubmitHandler<{ deactivationReason: string }> =
    useCallback(
      async (data) => {
        if (!user?._id) {
          return CustomToast({
            description: "Internal server error",
            status: "error",
          });
        }
        const status = REASON_CHANGE ? "deactivated" : decision;
        // If reason changes, status must stick with deactivated
        // Since deactivation reason can only be set in deactivated account
        const reason_remove =
          decision === "active" && data.deactivationReason.trim().length === 0;
        // To check if the decision is to activate the user account, and also check if the deactivation reason was removed
        // at this state, the current status is deactivated. I did this to fix the bug on status that when you activate the account
        // during deactivated phase, it still becomes deactivated with empty deactivation reason

        console.log(status);
        await ProcessStatus({
          admin_id: user?._id,
          status: reason_remove ? "active" : (status as IDecision),
          ...data,
        });
        setDecision("empty"); // Reset the process status button
        queryClient.invalidateQueries({ queryKey: ["admin-records"] }); // Invalidate the admin table
        reset({
          deactivationReason: "",
        }); // Reset the fields
        closeRef?.current?.click(); // Close the form
      },
      [decision, queryClient, user, REASON_CHANGE],
    );

  const onDecision = useCallback(() => {
    if (decision !== "empty") {
      return setDecision("empty");
    }

    if (isActive) {
      return setDecision("deactivated");
    }
    setDecision("active");
  }, [decision, isActive]);

  useEffect(() => {
    if (user?.deactivationReason) {
      setPrevReason(user?.deactivationReason);
    }
    reset({
      deactivationReason: user?.deactivationReason || "",
    });
  }, [user, reset]);

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[27rem] md:rounded-lg px-0">
        <form onSubmit={handleSubmit(onProcessStat)} className="space-y-3">
          <DialogHeader className="text-left px-6">
            <DialogTitle>
              Account {isActive ? "Deactivation" : "Activation"}
            </DialogTitle>
            <DialogDescription>
              {isActive
                ? "view account details and provide deactivation reason"
                : "activate this user account and restore access"}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full text-sm flex px-6 py-3 border-y items-center gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${fullName ?? "Uknown"}`}
              className="w-7 h-7 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium capitalize">
                {fullName ?? "User not found"}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                {user?.emailAddress ?? "Email not found"}
              </span>
            </div>
            <div className="ml-auto flex gap-x-2 items-center text-emerald-600 dark:text-emerald-500 capitalize">
              <span className="w-2 h-2 block rounded-full bg-emerald-500 dark:bg-emerald-600"></span>
              {user?.role === "super-admin" ? "head-admin" : user?.role}
            </div>
          </div>
          <div className="px-6">
            <Button
              type="button"
              variant="ghost"
              className={`w-full relative bg-transparent cursor-pointer ${
                decision !== "empty"
                  ? "border border-indigo-400 dark:border-indigo-900 bg-indigo-100 dark:bg-indigo-950/50"
                  : "border border-gray-300 dark:border-gray-900"
              } h-15 flex justify-start`}
              onClick={onDecision}
            >
              <Icon
                className={`absolute right-5 ${
                  decision !== "empty"
                    ? "text-indigo-500"
                    : "text-gray-950 dark:text-gray-200"
                }`}
              />
              <div className="flex flex-col justify-start items-start">
                <span className="text-gray-950 dark:text-gray-200">
                  {isActive ? "Deactivate Account" : "Activate Account"}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {!isActive
                    ? "allow user to have access"
                    : "revoke user's access"}
                </span>
              </div>
            </Button>
          </div>
          {OPEN_DECISION_AND_NOT_ACTIVE && (
            <div className="px-6">
              <div className="w-full mt-4 mb-3 flex flex-col text-sm rounded-lg px-5 py-4 border gap-y-1 gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
                <span className="mb-2">This usually happens when:</span>
                {REASONS.map((reason: string, index: number) => (
                  <div key={index} className="flex gap-x-2 relative">
                    <span className="transform translate-y-2 block h-[5px] w-[5px] rounded-full bg-gray-400 dark:bg-gray-400 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400">
                      {reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!OPEN_DECISION_AND_NOT_ACTIVE && (
            <div className="flex flex-col gap-y-3 px-6">
              <h1 className="text-sm font-medium">Deactivation Reason</h1>
              <Textarea
                placeholder="Enter deactivation reason"
                rows={3}
                {...register("deactivationReason", {
                  required:
                    "This field is required when deactivating an account",
                  minLength: {
                    value: 65,
                    message: "Provide at least 65 characters long",
                  },
                })}
              />
              {errors.deactivationReason && (
                <span className="flex gap-x-1 text-red-500 text-xs">
                  {errors.deactivationReason.message}
                </span>
              )}
            </div>
          )}
          <DialogFooter className="mt-4 flex-row gap-x-2 justify-end px-6">
            <DialogClose asChild className="flex-1">
              <Button variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                isSubmitting || (!REASON_CHANGE && decision === "empty") // No picked decision, just edited the deactivation reason
              }
              type="submit"
              className="flex-1"
            >
              {isSubmitting && <RefreshCcw className="animate-spin" />}
              {isActive ? "Update Status" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateAccDialog;
