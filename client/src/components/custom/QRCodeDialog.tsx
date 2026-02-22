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
import { useEffect, useRef, useState } from "react";
import useDarkMode from "@/hooks/useDarkMode";

interface IQRCode extends IOpenChange {
  data: IFireArm;
}

/*
1. I needed to use two QR code element. One is for UI display, and the other one is the that gets saved when user downloads the qr. 
2. The scanner can't scan regular qr code (with black and white color) in dark mode so I made the QR code flexible. 
3. The cons of doing flexible color of QR code is the image upload QR scanner. It can't detect non black and white color QR code. That's why I have to render two QR code elements here. 
*/

const QRCodeDialog = (props: IQRCode) => {
  const { open, onOpenChange, data } = props;
  const [darkMode] = useDarkMode();
  const [theme, setTheme] = useState<"dark" | "light">(
    darkMode ? "dark" : "light",
  );
  const qrRef = useRef(null);

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard high-quality QR size
    const CANVAS_SIZE = 1000;
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    const img = new Image();
    const svgBlob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // QR size inside canvas (with padding)
      const QR_SIZE = 800;

      const x = (CANVAS_SIZE - QR_SIZE) / 2;
      const y = (CANVAS_SIZE - QR_SIZE) / 2;

      // Clear background (optional: white bg)
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw centered QR
      ctx.drawImage(img, x, y, QR_SIZE, QR_SIZE);

      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "qr-code.png";
      a.click();
    };

    img.src = url;
  };

  // Checks if the data-theme becomes dark or light
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(newTheme as "dark" | "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

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
            value={JSON.stringify({
              _id: data?._id,
            })}
            size={130}
            bgColor={theme == "dark" ? "#0f172a" : "#ffffff"}
            fgColor={theme == "dark" ? "#ffffff" : "#000000"}
          /> {/* For QR displaying*/}
          <QRCode
            ref={qrRef}
            value={JSON.stringify({
              _id: data?._id,
            })}
            bgColor="#ffffff"
            fgColor="#000000"
            className="sr-only"
          /> {/* QR to be downloaded, fixed as black and white color*/} 
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
