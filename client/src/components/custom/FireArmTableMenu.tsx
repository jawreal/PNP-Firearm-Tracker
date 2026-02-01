import CustomInput from "@/components/custom/CustomInput";
import { Plus, ScanLine, Search, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import QRScannerDialog from "./QRScannerDialog";

interface IFireArmTableMenu {
  onOpenRegisterFireArm: () => void;
}

const FireArmTableMenu = ({ onOpenRegisterFireArm }: IFireArmTableMenu) => {
  const [openQRscan, setOpenQRscan] = React.useState<boolean>(false);

  const onOpenQRscan = React.useCallback(() => {
    setOpenQRscan(true);
  }, []);

  return (
    <React.Fragment>
      <QRScannerDialog open={openQRscan} onOpenChange={setOpenQRscan} />
      <div className="mt-1">
        {/* Search Input */}
        <CustomInput
          icon={Search}
          placeholder="Search firearm..."
          className="max-w-sm h-9 pl-9"
          iconClassName="top-2 left-2"
        />
      </div>
      <div className="ml-auto flex gap-x-2 items-center">
        {/* QR Search Button */}
        <Button variant="outline" onClick={onOpenQRscan} className="px-3">
          <ScanLine />
          <span className="hidden md:inline">QR Search</span>
        </Button>

        {/* Export and Register Firearm Buttons */}
        <Button variant="outline" className="px-3">
          <SquareArrowOutUpRight />
          <span className="hidden md:inline">Export Records</span>
        </Button>

        {/* Register Firearm Button */}
        <Button className="px-3" onClick={() => onOpenRegisterFireArm()}>
          <Plus />
          <span className="hidden md:inline">Register Firearm</span>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default React.memo(FireArmTableMenu);
