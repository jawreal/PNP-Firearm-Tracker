import CustomInput from "@/components/custom/CustomInput";
import {
  ListFilter,
  Plus,
  ScanLine,
  Search,
  SquareArrowOutUpRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import QRScannerDialog from "./QRScannerDialog";
import Papa from "papaparse";
import type { Table } from "@tanstack/react-table";
import StatusDropdown from "@/components/custom/CustomDropdown";

interface IFireArmTableMenu<T> {
  onOpenRegisterFireArm: () => void;
  table: Table<T>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: FireArmStatus | "Filter";
  setFilter: React.Dispatch<React.SetStateAction<FireArmStatus | "Filter">>;
  setSortKey: React.Dispatch<React.SetStateAction<SortFireArm>>;
}

const options: FireArmStatus[] = ["issued", "stocked", "loss", "disposition"];
const sortOptions: string[] = [
  "owner",
  "serial number",
  "firearm type",
  "station",
  "department",
];

const sortOptionMap: Record<string, SortFireArm> = {
  owner: "fullName",
  "serial number": "serialNumber",
  "firearm type": "fireArmType",
  station: "station",
  department: "department",
};

// I needed to use regular function instead of arrow function as a result of it arrow function breaks generics.
export default function FireArmTableMenu<T>({
  onOpenRegisterFireArm,
  table,
  search,
  setSearch,
  filter,
  setFilter,
  setSortKey,
}: IFireArmTableMenu<T>) {
  const [openQRscan, setOpenQRscan] = React.useState<boolean>(false);
  const [sortBy, setSortBy] = React.useState<string>("Sort by");

  const onOpenQRscan = React.useCallback(() => {
    setOpenQRscan(true); // for scanning qr
  }, []);

  const exportCSV = React.useCallback(() => {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "firearms.csv";
    link.click();
  }, [Papa, table]); // for exporting

  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value); // for searching
    },
    [setSearch],
  );

  const onSelectSortOption = React.useCallback(
    (e?: Event | undefined) => {
      e?.preventDefault();
      const id = (e?.currentTarget as HTMLElement)?.id;
      const sortKey = sortOptionMap[id];
      setSortBy(id); // for displaying selected option
      setSortKey(sortKey); // setting sort by key to be sent to server
    },
    [sortOptionMap],
  );

  return (
    <div className="w-full flex flex-col gap-y-3 md:flex-row ">
      <QRScannerDialog open={openQRscan} onOpenChange={setOpenQRscan} />
      <div className="w-full md:w-auto mt-1">
        {/* Search Input */}
        <CustomInput
          icon={Search}
          placeholder="Search firearm..."
          className="md:max-w-sm h-9 pl-9"
          iconClassName="top-2 left-2"
          value={search}
          onChange={onSearchChange}
        />
      </div>
      <div className="md:ml-auto flex gap-2 items-center flex-wrap">
        {/* Sort by Dropdown */}
        <StatusDropdown
          state={sortBy}
          onSelect={onSelectSortOption}
          options={sortOptions}
          icon={ArrowUpDown}
          leftIcon={true}
          btnClassName="[&_span]:hidden [&_span]:md:inline"
        />

        {/* Status Filter Dropdown */}
        <StatusDropdown
          state={filter}
          setState={setFilter}
          options={options}
          icon={ListFilter}
          leftIcon={true}
          btnClassName="[&_span]:hidden [&_span]:md:inline"
        />

        {/* QR Search Button */}
        <Button
          variant="outline"
          onClick={onOpenQRscan}
          className="px-3 [&_svg]:text-gray-500 [&_svg]:dark:text-gray-400"
        >
          <ScanLine />
          <span className="hidden lg:inline">QR Search</span>
        </Button>

        {/* Export and Register Firearm Buttons */}
        <Button
          variant="outline"
          className="px-3 [&_svg]:text-gray-500 [&_svg]:dark:text-gray-400"
          onClick={exportCSV}
        >
          <SquareArrowOutUpRight />
          <span className="hidden md:inline">Export</span>
        </Button>

        {/* Register Firearm Button */}
        <Button className="px-3" onClick={() => onOpenRegisterFireArm()}>
          <Plus />
          <span className="hidden md:inline">Register</span>
        </Button>
      </div>
    </div>
  );
}
