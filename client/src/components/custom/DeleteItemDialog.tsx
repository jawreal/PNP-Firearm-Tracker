import { Fragment, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomToast } from "@/components/custom/CustomToast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface IDelete extends IOpenChange {
  itemName: string;
  item_id: string;
}

// Item name purpose is to show what is going to be deleted

const DeleteItemDialog = ({
  itemName,
  item_id,
  open,
  onOpenChange,
}: IDelete) => {
  const queryClient = useQueryClient();
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading">("idle");

  const onClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const onDelete = useCallback(async () => {
    try {
      setDeleteStatus("loading");
      if (!item_id) {
        throw new Error("Quiz id is required for deleting quiz");
      }
      const response = await fetch("/api/quiz/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete the quiz");
      }
      queryClient.invalidateQueries({
        queryKey: ["quizzes"],
      }); // refetch the quizzes in app sidebar
      CustomToast({
        status: "success",
        description: "Record is successfully deleted",
      });
    } catch (err) {
      console.error(err);
      CustomToast({
        status: "error",
        description: "Failed to delete the record. Please try again.",
      });
    } finally {
      setDeleteStatus("idle");
      onClose();
    }
  }, [item_id, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-y-0 md:max-w-[26rem] font-inter flex flex-col">
        <DialogHeader className="text-left">
          <DialogTitle className="font-inter text-1xl transform -translate-y-2 truncate pr-7">
            {itemName
              ? `Confirm deletion of ${itemName} record?`
              : "Failed to load the record"}
          </DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <Alert
          variant="destructive"
          className="mt-1 max-[5rem] dark:bg-red-900/30 dark:text-red-600"
        >
          <CircleAlert size={19} className="dark:text-red-600" />
          <AlertTitle>This action cannot be undone</AlertTitle>
          <AlertDescription className="w-full max-w-80">
            Are you sure you want to delete this record?
          </AlertDescription>
        </Alert>
        <DialogFooter className="mt-4 flex-row gap-x-2">
          <Button
            disabled={deleteStatus === "loading"}
            onClick={onClose}
            variant="outline"
            className="flex-1 border border-gray-300 dark:border-gray-700 shadow-none hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            disabled={deleteStatus === "loading"}
            onClick={onDelete}
            className="cursor-pointer flex-1 border border-red-400 bg-red-300/40 dark:bg-red-900/70 dark:border-red-700 shadow-none text-red-500 dark:text-red-50 hover:bg-red-200 dark:hover:bg-red-900"
          >
            {deleteStatus === "loading" ? (
              <Fragment>
                <RefreshCw size={20} className="animate-spin" />
                <span>Deleting...</span>
              </Fragment>
            ) : (
              <span>Delete</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(DeleteItemDialog);
