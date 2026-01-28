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
import { useRef } from "react";

interface IQRCode extends IOpenChange {
  data: IFireArm;
}

const QRCodeDialog = (props: IQRCode) => {
  const { open, onOpenChange, data } = props;
  const qrRef = useRef(null);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const svgBlob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qr-code.png";
      a.click();
    };

    img.src = url;
  };

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
            ref={qrRef}
            value={JSON.stringify(data)}
            size={130}
            bgColor="#ffffff"
            fgColor="#000000"
          />
        </div>
        <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end">
          <DialogClose asChild>
            <Button type="submit" onClick={downloadQR} className="flex-1 h-10">
              Download as PNG
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeDialog;
