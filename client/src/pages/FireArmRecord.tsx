import FireArmTable from "@/components/custom/FireArmTable";
import StatisticCard from "@/components/custom/StatisticCard";
import { Button } from "@/components/ui/button";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import { cn } from "@/lib/utils";
import { FileCheck, Package, AlertTriangle, FileX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const FireArmRecord = () => {
  const [page, setPage] = useState<number>(1);
  const [recordType, setRecordType] = useState<"active" | "archive">("active"); // for navigating to all record or archive
  const [recordStatus, setRecordStatus] = useState<FireArmStatus | "Filter">(
    "Filter",
  );
  const [sortKey, setSortKey] = useState<SortFireArm>("Sort by");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 800);
  const queryKey = useMemo(
    () => ["firearm-records", page, debouncedSearch, recordStatus, sortKey],
    [page, debouncedSearch, recordStatus, sortKey],
  );
  const { data, isLoading, error } = useFetchData<RecordQuery<IFireArm>>(
    `/api/firearm/retrieve?page=${page}&search=${debouncedSearch}&filter=${recordStatus}&sortKey=${sortKey}`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );
  const STATS_DATA = useMemo(
    () => ({
      totalIssued: {
        title: "Total Issued",
        icon: FileCheck,
        additionalDetail: "Assigned to personnel",
      },
      totalStocked: {
        title: "Total Stocked",
        icon: Package,
        additionalDetail: "In inventory",
      },
      totalLoss: {
        title: "Total Loss",
        icon: AlertTriangle,
        additionalDetail: "Lost / missing",
      },
      totalDisposition: {
        title: "Total Disposition",
        icon: FileX,
        additionalDetail: "Disposed / transferred",
      },
    }),
    [],
  );

  const onChangeRecordType = useCallback(() => {
    setRecordType((prev) => (prev === "active" ? "archive" : "active"));
  }, []);

  useEffect(() => {
    setPage(1); // Reset to first page when search query changes
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-[80rem] flex flex-col pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-3xl font-medium">Firearm Records</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all firearm records
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-5">
        {data?.statistics.map((stat, index: number) => {
          const stat_key = Object.keys(stat)[0];
          const field = STATS_DATA[stat_key as keyof typeof STATS_DATA];
          return (
            <StatisticCard
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
              "px-0 pb-5 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
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
              "px-0 pb-5 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
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
      />
    </div>
  );
};

export default FireArmRecord;
