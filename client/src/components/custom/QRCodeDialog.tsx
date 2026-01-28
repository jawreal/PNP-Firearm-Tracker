import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface IQRCode extends IOpenChange {
  data: IFireArm;
}

const QRCodeDialog = (props: IQRCode) => {
  const { open, onOpenChange, data } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] md:max-w-[22rem] rounded-lg">
        <DialogHeader className="items-center">
          <DialogTitle>Scan QR Code</DialogTitle>
          <DialogDescription className="text-center">
            Download the file, or take a screenshot to keep it on your device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-6">
          <QRCode
            value={JSON.stringify(data)}
            size={130}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end">
          <DialogClose asChild>
            <Button type="submit" className="flex-1 h-10">
              Download as PNG
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
