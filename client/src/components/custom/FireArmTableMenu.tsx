import CustomInput from "@/components/custom/CustomInput";
import {
  ListFilter,
  ScanLine,
  Search,
  ArrowUpDown,
  AlignJustify,
  AlignRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import * as React from "react";
import QRScannerDialog from "@/components/custom/QRScannerDialog";
import StatusDropdown from "@/components/custom/CustomDropdown";
import QRDetails from "@/components/custom/QRDetails";
import DateFilter from "@/components/custom/DateFilter";
import useGunType from "@/hooks/useGuntType";
import { cn } from "@/lib/utils";

interface IFireArmTableMenu {
  search: string;
  debouncedSearch: string;
  onApply: (dateParams: string | null) => void;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filter: FireArmStatus | "Filter";
  setFilter: React.Dispatch<React.SetStateAction<FireArmStatus | "Filter">>;
  setSortKey: React.Dispatch<React.SetStateAction<SortFireArm>>;
  selectedRange: ISelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<ISelectedRange>>;
}

const options: FireArmStatus[] = [
  "issued",
  "stocked",
  "loss",
  "disposition",
  "turn in",
];
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

const QRKeys: Record<string, string> = {
  serialNumber: "Serial No.",
  fullName: "Owner",
  fireArmType: "Type",
  fireArmMake: "Make",
  station: "Station",
  department: "Department",
  status: "Status",
  createdAt: "Registered Date",
};

// I needed to use regular function instead of arrow function as a result of it arrow function breaks generics.
export default function FireArmTableMenu({
  search,
  debouncedSearch,
  setSearch,
  filter,
  setFilter,
  setSortKey,
  selectedRange,
  setSelectedRange,
  onApply,
}: IFireArmTableMenu) {
  const { gunType, setGunType } = useGunType();
  const [openQRscan, setOpenQRscan] = React.useState<boolean>(false);
  const [selectedData, setSelectedData] = React.useState<
    Record<string, string>
  >({});
  const [openQRdetails, setOpenQRdetails] = React.useState<boolean>(false);
  const [sortBy, setSortBy] = React.useState<string>("Sort by");

  const onOpenQRscan = React.useCallback(() => {
    setOpenQRscan(true); // for scanning qr
  }, []);

  const onSearchChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value); // for searching
    },
    [setSearch],
  );

  const onInputRemoval = React.useCallback(() => {
    setSearch("");
  }, [setSearch]);

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

  const onChangeGunType = React.useCallback(() => {
    setGunType(gunType === "long" ? "short" : "long");
  }, [gunType, setGunType]);

  return (
    <div className="w-full flex flex-col gap-y-3 md:flex-row">
      <QRScannerDialog
        open={openQRscan}
        onOpenChange={setOpenQRscan}
        setSelectedData={setSelectedData}
        setOpenQRdetails={setOpenQRdetails}
      />
      <div className="w-full md:w-auto">
        {/* Search Input */}
        <CustomInput
          icon={Search}
          placeholder="Search firearm..."
          className="md:max-w-sm h-9 pl-9"
          iconClassName="top-2 left-2"
          value={search}
          onChange={onSearchChange}
          isSearch={debouncedSearch?.trim()?.length > 0}
          onInputRemoval={onInputRemoval}
        />
      </div>
      <QRDetails
        data={selectedData ?? {}}
        open={openQRdetails}
        dataKeys={QRKeys}
        onOpenChange={setOpenQRdetails}
        title="Firearm Details"
        description="view firearm details from QR result"
      />
      <div className="md:ml-auto flex gap-2 items-center flex-wrap">
        <DateFilter
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          onApply={onApply}
        />

        {/* Sort by Dropdown */}
        <StatusDropdown
          state={sortBy}
          onSelect={onSelectSortOption}
          options={sortOptions}
          icon={ArrowUpDown}
          leftIcon={true}
          btnClassName={`[&_span]:hidden [&_span]:md:inline ${sortBy !== "Sort by" && "capitalize"}`}
          dropdownLabel="Sort by"
        />

        {/* Status Filter Dropdown */}
        <StatusDropdown
          state={filter}
          setState={setFilter}
          options={options}
          icon={ListFilter}
          leftIcon={true}
          btnClassName={`[&_span]:hidden [&_span]:md:inline ${filter !== "Filter" && "capitalize"}`}
          dropdownLabel="Filter by"
        />

        {/* QR Search Button */}
        <Button
          variant="outline"
          onClick={onOpenQRscan}
          className="px-3 [&_svg]:text-gray-400 rounded-lg text-gray-600 dark:text-gray-200"
        >
          <ScanLine />
          <span className="hidden md:inline">QR Search</span>
        </Button>
        <Button
          variant="outline"
          className={cn(
            "rounded-full [&_svg]:text-gray-400 text-gray-600 dark:text-gray-200",
            gunType === "long" &&
              "border-blue-400 [&_svg]:text-blue-500 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-500 text-blue-500 bg-blue-100/50",
          )}
          onClick={onChangeGunType}
        >
          <AlignJustify />
          Long
        </Button>
        <Button
          variant="outline"
          className={cn(
            "rounded-full [&_svg]:text-gray-400 text-gray-600 dark:text-gray-200",
            gunType === "short" &&
              "border-blue-400 [&_svg]:text-blue-500 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-500 text-blue-500 bg-blue-100/50",
          )}
          onClick={onChangeGunType}
        >
          <AlignRight />
          Short
        </Button>
      </div>
    </div>
  );
}
