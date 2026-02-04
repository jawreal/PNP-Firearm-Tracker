import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { ImageUp, ScanQrCode, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { CustomToast } from "./CustomToast";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { BrowserMultiFormatReader } from "@zxing/browser";

const QRScannerDialog = (props: IOpenChange) => {
  const { open, onOpenChange } = props;
  const [scanning, setScanning] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const reader = new BrowserMultiFormatReader();

  const onStartScanning = () => {
    setScanning((state) => !state);
  };

  const handleScan = useCallback((detectedCodes: IDetectedBarcode[]) => {
    console.log("Detected codes:", detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach((code: IDetectedBarcode) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  }, []);

  const handleError = useCallback((error: unknown) => {
    console.error("QR Scan Error:", error);
    CustomToast({
      description: "Failed to scan QR code. Please try again.",
      status: "error",
    });
  }, []);

  const onOpenFileUpload = useCallback(() => {
    // Open file input
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  }, [uploadRef]);

  const onScanImgFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const imgUrl = URL.createObjectURL(file);
      // Create a temporary URL for the image file (e.g., blob:http://...)
      // ZXing only accepts URLs for image decoding so it must be done this way

      try {
        const result = await reader.decodeFromImageUrl(imgUrl);
        // Pass the image URL to ZXing for decoding
        console.log("Decoded text:", result.getText()); // The decoded text from the QR code
        e.target.value = ""; // Reset the input value to allow re-uploading the same file
      } catch (err) {
        CustomToast({
          description: "Failed to scan QR code. Please try again.",
          status: "error",
        });
        console.error("No QR / barcode found", err);
      }
    },
    [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] md:max-w-[25rem] overflow-hidden rounded-lg p-0">
        {/* Hidden elements to avoid errors */}
        <div className="hidden">
          <DialogTitle />
          <DialogDescription />
        </div>

        {/* Image to show before scanning */}
        <div className="w-full md:max-h-80 md:max-w-[25rem]">
          {scanning ? (
            <Scanner onScan={handleScan} onError={handleError} />
          ) : (
            <div className="w-full h-80 flex flex-col pt-20 items-center md:h-[25rem]">
              <img
                src="/upload_img.svg"
                alt="QR Placeholder"
                className="w-40 h-40 border rounded-md bg-indigo-100 dark:bg-indigo-950/80 border-gray-300 dark:border-gray-700"
              />
              <span className="text-xs mt-3 px-20 text-center text-gray-500 dark:text-gray-400">
                Upload accepted format: PNG, JPG, JPEG, SVG, WebP (Max 5MB)
              </span>
            </div>
          )}
        </div>
        <Input
          type="file"
          ref={uploadRef}
          className="hidden"
          onChange={onScanImgFile}
        />
        <DialogFooter className="flex-col md:flex-row gap-y-2 pb-4 px-4">
          <Button
            variant="outline"
            disabled={scanning}
            className="flex-1 items-center"
            onClick={onOpenFileUpload}
          >
            <ImageUp /> Upload Image
          </Button>
          <Button
            type="submit"
            onClick={onStartScanning}
            className={cn("flex-1 items-center", scanning && "!bg-red-600")}
          >
            {scanning ? (
              <div className="flex items-center">
                <X className="mr-2 size-[20px]" />
                <span>Stop Scanning</span>
              </div>
            ) : (
              <div className="flex items-center">
                <ScanQrCode className="mr-2" />
                <span>Start Scanning</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRScannerDialog;
