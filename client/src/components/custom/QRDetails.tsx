import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCallback } from "react";

interface IQRCode<T extends Record<string, string>> extends IOpenChange {
  data: T;
  dataKeys: T;
  title: string;
  description: string;
}

const QRDetails = <T extends Record<string, string>>(props: IQRCode<T>) => {
  const { open, onOpenChange, title, description, data, dataKeys } = props;

  const onClose = useCallback(() => onOpenChange(false), []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] md:max-w-[23rem] rounded-lg gap-y-5">
        <DialogHeader className="items-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-y-3">
          {Object.keys(data).map((k, i) => (
            <div
              className="grid grid-cols-2 text-sm font-medium capitalize"
              key={i}
            >
              <span className="text-gray-500">{dataKeys[k]}</span>
              <span className="text-end">{data[k]}</span>
            </div>
          ))}
        </div>
        <DialogFooter className="w-full flex-col md:flex-row gap-y-2">
          <Button className="w-full" onClick={onClose}>
            Ok, I understand!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRDetails;
