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
import { useCallback, useMemo, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useForm, type SubmitHandler } from "react-hook-form";
import ProcessStatus from "@/services/processAdminStat";
import { RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface IProps extends IOpenChange {
  user: IAdminUsers;
}

const DeactivateAccDialog = (props: IProps) => {
  const { user, ...rest } = props;
  const queryClient = useQueryClient();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const isActive = useMemo(() => user?.status === "active", [user?.status]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<{ deactivationReason: string }>({
    mode: "onChange",
  });

  const onProcessStat: SubmitHandler<{ deactivationReason: string }> =
    useCallback(
      async (data) => {
        const status = isActive ? "deactivated" : "active";
        await ProcessStatus({
          admin_id: "6993cccda9c82a771e4fe68a", // for development only
          status,
          ...data,
        });
        queryClient.invalidateQueries({ queryKey: ["admin-records"] });
        reset();
        closeRef?.current?.click(); // Close the form
      },
      [isActive, queryClient],
    );

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
              <p className="text-sm font-medium">
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
              </p>
            </div>
            {user?.status !== "active" && (
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Deactivation Reason
                </span>
                <p className="text-sm font-medium">
                  {user?.deactivationReason ?? "Not found"}
                </p>
              </div>
            )}
          </div>
          {user?.status === "active" && (
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
          <DialogFooter className="mt-4 flex-row gap-x-2">
            <DialogClose asChild className="flex-1">
              <Button variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isSubmitting}
              className={cn(
                "cursor-pointer flex-1",
                isActive &&
                  "border border-red-400 bg-red-300/40 dark:bg-red-900/70 dark:border-red-700 shadow-none text-red-500 dark:text-red-50 hover:bg-red-200 dark:hover:bg-red-900",
              )}
              type="submit"
            >
              {isSubmitting && <RefreshCcw className="animate-spin" />}
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateAccDialog;
