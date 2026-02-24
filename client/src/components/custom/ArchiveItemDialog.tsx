import { Fragment, useCallback, memo, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomToast } from "@/components/custom/CustomToast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface IDelete extends IOpenChange {
  itemName: string;
  item_id: string;
  isArchived: boolean;
}

const ArchiveItemDialog = ({
  itemName,
  item_id,
  isArchived,
  open,
  onOpenChange,
}: IDelete) => {
  const queryClient = useQueryClient();
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading">("idle");

  const action = useMemo(
    () => (isArchived ? "restore" : "archive"),
    [isArchived],
  );
  const actionLabel = useMemo(
    () => (isArchived ? "Restore" : "Archive"),
    [isArchived],
  );

  const onClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const onArchive = useCallback(async () => {
    try {
      setDeleteStatus("loading");
      if (!item_id) {
        throw new Error(`_id is required for ${action}ing record`);
      }
      const response = await fetch("/api/firearm/archive/registry", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: item_id,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to ${action} the firearm record`);
      }
      queryClient.invalidateQueries({
        queryKey: ["firearm-records"],
      });
      CustomToast({
        status: "success",
        description: `Record is successfully ${action}d`,
      });
    } catch (err) {
      console.error(err);
      CustomToast({
        status: "error",
        description: `Failed to ${action} the record. Please try again.`,
      });
    } finally {
      setDeleteStatus("idle");
      onClose();
    }
  }, [item_id, action, onClose]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-y-0 md:max-w-[26rem] font-inter flex flex-col">
        <DialogHeader className="text-left space-y-0">
          <DialogTitle className="font-inter text-1xl transform -translate-y-2 line-cla2 pr-7">
            {itemName
              ? `${actionLabel} record for ${itemName}?`
              : "Failed to load the record"}
          </DialogTitle>
          <DialogDescription>
            {isArchived
              ? "Restoring this record will move it back to the active list. It will no longer appear in the archive."
              : "Archiving this record will move it to the Archive page. It will no longer appear in the active list, but you can restore it at any time."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 flex-row gap-x-2">
          <Button
            disabled={deleteStatus === "loading"}
            onClick={onClose}
            variant="outline"
            className="flex-1 border"
          >
            Cancel
          </Button>
          <Button
            disabled={deleteStatus === "loading"}
            onClick={onArchive}
            className="cursor-pointer flex-1"
          >
            {deleteStatus === "loading" ? (
              <Fragment>
                <RefreshCw size={20} className="animate-spin" />
                <span>{actionLabel}ing...</span>
              </Fragment>
            ) : (
              <span>Yes, {action} it</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ArchiveItemDialog);
