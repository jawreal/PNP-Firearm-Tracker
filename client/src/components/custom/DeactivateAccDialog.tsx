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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import ProcessStatus from "@/services/processAdminStat";
import { RefreshCcw, UserRoundCheck, UserRoundX } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { CustomToast } from "./CustomToast";

interface IProps extends IOpenChange {
  user: IAdminUsers;
}

type IDecision = "active" | "deactivated";

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
        console.log(status);
        await ProcessStatus({
          admin_id: user?._id,
          status: status as IDecision,
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
      <DialogContent className="sm:max-w-[425px] md:max-w-[27rem] md:rounded-lg">
        <form onSubmit={handleSubmit(onProcessStat)} className="space-y-3">
          <DialogHeader className="text-left">
            <DialogTitle>
              Account {isActive ? "Deactivation" : "Activation"}
            </DialogTitle>
            <DialogDescription>
              {isActive
                ? "view account details and provide deactivation reason"
                : "activate this user account and restore access"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 border rounded-xl px-4 py-3 bg-gray-100/60 dark:bg-gray-900/60 dark:border-gray-800">
            <div className="grid grid-cols-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Fullname
                </span>
                <p className="text-sm font-medium capitalize">
                  {`${user?.firstName ?? "Not found"} ${user?.lastName ?? ""}`}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Username
                </span>
                <p className="font-medium text-blue-700 dark:text-blue-600 text-sm">
                  {`${user?.userName ?? "Not found"}`}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Role
                </span>
                <p className="text-sm font-medium capitalize">
                  {`${user?.role ?? "Not found"}`}
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Status
                </span>
                <p className="text-sm font-medium capitalize">
                  {user?.status ?? "Not found"}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Description
              </span>
              <div className="font-medium text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ ...props }) => (
                      <strong
                        {...props}
                        className="font-medium text-blue-700 dark:text-blue-600"
                      />
                    ),
                  }}
                >
                  {user?.description ?? "Not found"}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className={`w-full relative bg-transparent cursor-pointer ${
              decision !== "empty"
                ? "border-2 border-indigo-400 dark:border-indigo-900 bg-indigo-100 dark:bg-indigo-950/50"
                : "border-2 border-gray-300 dark:border-gray-900"
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
          {!OPEN_DECISION_AND_NOT_ACTIVE && (
            <div className="flex flex-col gap-y-3">
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
          <DialogFooter className="mt-4 flex-row gap-x-2 justify-end">
            <DialogClose asChild>
              <Button variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={
                isSubmitting || (!REASON_CHANGE && decision === "empty") // No picked decision, just edited the deactivation reason
              }
              type="submit"
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
