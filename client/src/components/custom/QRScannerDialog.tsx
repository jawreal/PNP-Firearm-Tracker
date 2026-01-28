import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const QRScannerDialog = (props: IOpenChange) => {
  const { open, onOpenChange } = props;
  const [scanning, setScanning] = useState(false);

  const onStartScanning = () => {
    setScanning((state) => !state);
  };

  const handleScan = (detectedCodes) => {
    console.log("Detected codes:", detectedCodes);
    // detectedCodes is an array of IDetectedBarcode objects
    detectedCodes.forEach((code) => {
      console.log(`Format: ${code.format}, Value: ${code.rawValue}`);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] md:max-w-[30rem] overflow-hidden rounded-lg p-0">
        <div className="flex-1">
          {scanning ? (
            <Scanner
              onScan={handleScan}
              onError={(error) => console.log(error?.message)}
            />
          ) : (
            <div className="dark:bg-black w-full h-80  md:h-[30rem]"></div>
          )}
        </div>
        <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end px-4 pb-4">
          <Button
            type="submit"
            onClick={onStartScanning}
            className={cn(
              "flex-1 h-11 items-center",
              scanning && "!bg-red-600",
            )}
          >
            {scanning ? (
              <div className="flex items-center">
                <X className="mr-2 size-[20px]" />
                <span>Stop Scanning</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Camera className="mr-2" />
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
