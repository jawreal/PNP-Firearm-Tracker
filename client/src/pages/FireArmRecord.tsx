import FireArmTable from "@/components/custom/FireArmTable";
import StatisticCard from "@/components/custom/StatisticCard";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import { FileCheck, Package, AlertTriangle, FileX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FireArmRecord = () => {
  const [page, setPage] = useState<number>(1);
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
      },
      totalStocked: {
        title: "Total Stocked",
        icon: Package,
      },
      totalLoss: {
        title: "Total Loss",
        icon: AlertTriangle,
      },
      totalDisposition: {
        title: "Total Disposition",
        icon: FileX,
      },
    }),
    [],
  );
  console.log(data);
  useEffect(() => {
    setPage(1); // Reset to first page when search query changes
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-[73rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Firearm Records</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all firearm records
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.statistics.map((stat, index: number) => {
          const stat_key = Object.keys(stat)[0];
          const field = STATS_DATA[stat_key as keyof typeof STATS_DATA];
          return (
            <StatisticCard
              totalNumber={stat[stat_key]}
              title={field?.title ?? "Title not found"}
              icon={field?.icon}
              key={index}
            />
          );
        })}
      </div>
      <FireArmTable
        data={data?.record || []}
        totalPages={data?.totalPages || 0}
        error={error}
        isLoading={isLoading}
        search={search}
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
