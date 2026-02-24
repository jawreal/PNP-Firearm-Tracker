import { Fragment, useCallback, memo } from "react";
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
}

// Item name purpose is to show what is going to be deleted

const ArchiveItemDialog = ({
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
        throw new Error("_id is required for archiving record");
      }
      const response = await fetch("/api/firearm/archive/registry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: item_id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to archive the fiream record");
      }
      queryClient.invalidateQueries({
        queryKey: ["firearm-records"],
      }); // refetch the firearm records
      CustomToast({
        status: "success",
        description: "Record is successfully archived",
      });
    } catch (err) {
      console.error(err);
      CustomToast({
        status: "error",
        description: "Failed to archive the record. Please try again.",
      });
    } finally {
      setDeleteStatus("idle");
      onClose();
    }
  }, [item_id, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] gap-y-0 md:max-w-[26rem] font-inter flex flex-col">
        <DialogHeader className="text-left space-y-0">
          <DialogTitle className="font-inter text-1xl transform -translate-y-2 line-cla2 pr-7">
            {itemName
              ? `Archive record for ${itemName}?`
              : "Failed to load the record"}
          </DialogTitle>
          <DialogDescription>
            Archiving this record will move it to the Archive page. It will no
            longer appear in the active list, but you can restore it at any
            time.
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
            onClick={onDelete}
            className="cursor-pointer flex-1"
          >
            {deleteStatus === "loading" ? (
              <Fragment>
                <RefreshCw size={20} className="animate-spin" />
                <span>Archiving...</span>
              </Fragment>
            ) : (
              <span>Yes, archive it</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ArchiveItemDialog);
