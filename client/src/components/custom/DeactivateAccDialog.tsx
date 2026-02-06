import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProps extends IOpenChange {
  user: IAdminUsers;
}

const DeactivateAccDialog = (props: IProps) => {
  const { user, ...rest } = props;
  const isActive = useMemo(() => user?.status === "active", [user?.status]);

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[27rem] md:rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>
            Account {isActive ? "Deactivation" : "Activation"}
          </DialogTitle>
          <DialogDescription>
            {isActive
              ? "deactivate user account and provide a reason"
              : "activate user account"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 border rounded-xl px-4 py-3 bg-gray-100/60 dark:bg-gray-900/60 dark:border-gray-800">
          <div className="grid grid-cols-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Fullname
              </span>
              <p className="text-sm font-medium">
                {`${user?.fullName ?? "Not found"}`}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Username
              </span>
              <p className="text-sm font-medium">
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
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-medium">Deactivation Reason</h1>
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            provide a reason for deactivating this account
          </span>
          <Textarea placeholder="Enter deactivation reason" rows={3} />
        </div>
        <DialogFooter className="mt-4 flex-row gap-x-2">
          <Button
            variant="outline"
            className="flex-1 border border-gray-300 dark:border-gray-700 shadow-none hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button className="cursor-pointer flex-1 border border-red-400 bg-red-300/40 dark:bg-red-900/70 dark:border-red-700 shadow-none text-red-500 dark:text-red-50 hover:bg-red-200 dark:hover:bg-red-900">
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateAccDialog;
