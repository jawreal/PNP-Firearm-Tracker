import FireArmTable from "@/components/custom/FireArmTable";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import { cn } from "@/lib/utils";
import {
  FileCheck,
  Package,
  AlertTriangle,
  FileX,
  SquareArrowOutUpRight,
  Plus,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import FireArmStatsCard from "@/components/custom/FireArmStatsCard";
import type { FIREARM_STATUS_STYLES } from "@/components/ui/badge";

interface IStatsData extends Omit<StatsType, "additionalDetail"> {
  statsKey: keyof typeof FIREARM_STATUS_STYLES;
}

const STATS_DATA: Record<string, IStatsData> = {
  totalTurnIn: {
    title: "Total turn in",
    icon: Undo2,
    statsKey: "turn in",
  },
  totalIssued: {
    title: "Total issued",
    icon: FileCheck,
    statsKey: "issued",
  },
  totalStocked: {
    title: "Total stocked",
    icon: Package,
    statsKey: "stocked",
  },
  totalLoss: {
    title: "Total loss",
    icon: AlertTriangle,
    statsKey: "loss",
  },
  totalDisposition: {
    title: "Disposition",
    icon: FileX,
    statsKey: "disposition",
  },
};

const FireArmRecord = () => {
  const [page, setPage] = useState<number>(1);
  const firearmRef = useRef<RefHandle | null>(null);
  const [recordType, setRecordType] = useState<"active" | "archive">("active"); // for navigating to all record or archive
  const [recordStatus, setRecordStatus] = useState<FireArmStatus | "Filter">(
    "Filter",
  );
  const [sortKey, setSortKey] = useState<SortFireArm>("Sort by");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 800);
  const queryKey = useMemo(
    () => [
      "firearm-records",
      page,
      debouncedSearch,
      recordStatus,
      sortKey,
      recordType,
    ],
    [page, debouncedSearch, recordStatus, sortKey, recordType],
  );
  const { data, isLoading, error } = useFetchData<RecordQuery<IFireArm>>(
    `/api/firearm/retrieve?page=${page}&search=${debouncedSearch}&filter=${recordStatus}&sortKey=${sortKey}&recordType=${recordType}`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

  const onChangeRecordType = useCallback(() => {
    setRecordType((prev) => (prev === "active" ? "archive" : "active"));
  }, []);

  const handleExport = useCallback(() => {
    firearmRef?.current?.export();
  }, [firearmRef]); // call the export function inside firearm table

  const handleRegister = useCallback(() => {
    firearmRef?.current?.openRegister();
  }, [firearmRef]); // call the register function the firearm table

  useEffect(() => {
    setPage(1); // Reset to first page when search query changes
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-[80rem] flex flex-col pb-[4.5rem] md:pb-0">
      <div className="flex flex-col md:flex-row md:items-center gap-y-2">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-medium">Firearm Records</h1>
          <span className="text-gray-500 dark:text-gray-400">
            Manage all firearm records
          </span>
        </div>
        <div className="flex gap-2 md:ml-auto flex-wrap">
          {/* Export Firearm Button */}
          <Button
            variant="outline"
            className="px-3 [&_svg]:text-gray-500 [&_svg]:dark:text-gray-400"
            onClick={handleExport}
          >
            <SquareArrowOutUpRight />
            <span>Export</span>
          </Button>

          {/* Register Firearm Button */}
          <Button className="px-3" onClick={handleRegister}>
            <Plus />
            <span>Register</span>
          </Button>
        </div>
      </div>
      <div className="flex md:grid overflow-auto md:grid-cols-3 lg:grid-cols-5 gap-y-3 gap-x-3 rounded-md my-4">
        {data?.statistics.map((stat, index: number) => {
          const stat_key = Object.keys(stat)[0];
          const field = STATS_DATA[stat_key as keyof typeof STATS_DATA];
          return (
            <FireArmStatsCard
              totalNumber={stat[stat_key]}
              {...field}
              key={index}
            />
          );
        })}
      </div>
      <div className="flex flex-col gap-y-0 md:mb-1">
        <div className="flex gap-x-3">
          <Button
            variant="ghost"
            className={cn(
              "px-0 pb-4 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
              recordType === "active" &&
                "text-indigo-600 dark:text-indigo-500 [&_div]:bg-indigo-500 [&_div]:block",
            )}
            onClick={onChangeRecordType}
          >
            Active list
            <div className="mt-1 h-[2.4px] w-full absolute bottom-0"></div>
          </Button>
          <Button
            variant="ghost"
            onClick={onChangeRecordType}
            className={cn(
              "px-0 pb-4 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
              recordType === "archive" &&
                "text-indigo-600 dark:text-indigo-500 [&_div]:bg-indigo-500 [&_div]:block",
            )}
          >
            Archived
            <div className="mt-1 h-[2.4px] w-full absolute bottom-0"></div>
          </Button>
        </div>
        <hr />
      </div>
      <FireArmTable
        data={data?.record || []}
        totalPages={data?.totalPages || 0}
        error={error}
        isLoading={isLoading}
        search={search}
        debouncedSearch={debouncedSearch}
        setSearch={setSearch}
        setPage={setPage}
        currentPage={page}
        hasNextPage={data?.hasNextPage ?? false}
        filter={recordStatus}
        setFilter={setRecordStatus}
        setSortKey={setSortKey}
        ref={firearmRef}
      />
    </div>
  );
};

export default FireArmRecord;
