import CustomInput from "@/components/custom/CustomInput";
import { Plus, ScanLine, Search, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import QRScannerDialog from "./QRScannerDialog";
import Papa from "papaparse";
import type { Table } from "@tanstack/react-table";

interface IFireArmTableMenu<T> {
  onOpenRegisterFireArm: () => void;
  table: Table<T>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

// I needed to use regular function instead of arrow function as a result of it arrow function breaks generics.
export default function FireArmTableMenu<T>({
  onOpenRegisterFireArm,
  table,
  search,
  setSearch,
}: IFireArmTableMenu<T>) {
  const [openQRscan, setOpenQRscan] = React.useState<boolean>(false);

  const onOpenQRscan = React.useCallback(() => {
    setOpenQRscan(true);
  }, []);

  const exportCSV = React.useCallback(() => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "firearms.csv";
    link.click();
  }, [Papa, table]);

  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    [setSearch],
  );

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
          value={search}
          onChange={onSearchChange}
        />
      </div>
      <div className="ml-auto flex gap-x-2 items-center">
        {/* QR Search Button */}
        <Button variant="outline" onClick={onOpenQRscan} className="px-3">
          <ScanLine />
          <span className="hidden md:inline">QR Search</span>
        </Button>

        {/* Export and Register Firearm Buttons */}
        <Button variant="outline" className="px-3" onClick={exportCSV}>
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
}
