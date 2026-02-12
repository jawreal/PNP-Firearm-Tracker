import FireArmTable from "@/components/custom/FireArmTable";
import StatisticCard from "@/components/custom/StatisticCard";
import useDebounce from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import {
  FileCheck,
  Package,
  AlertTriangle,
  FileX,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const icons: Record<string, LucideIcon> = {
  issued: FileCheck,
  stocked: Package,
  loss: AlertTriangle,
  disposition: FileX,
};

const mockupData = [
  {
    totalName: "Total Issued",
    totalNumber: 120,
    icon: icons["issued"],
  },
  {
    totalName: "Total Stocked",
    totalNumber: 10,
    icon: icons["stocked"],
  },
  {
    totalName: "Total Loss",
    totalNumber: 20,
    icon: icons["loss"],
  },
  {
    totalName: "Total Disposition",
    totalNumber: 30,
    icon: icons["disposition"],
  },
];

interface RecordQuery {
  record: IFireArm[];
  hasNextPage: boolean;
  totalPages: number;
}

const FireArmRecord = () => {
  const [page, setPage] = useState<number>(1);
  const [recordStatus, setRecordStatus] = useState<FireArmStatus | "Filter">(
    "Filter",
  );
  const [sortKey, setSortKey] = useState<ISortOption>("Sort by");
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 800);
  const queryKey = useMemo(
    () => ["firearm-records", page, debouncedSearch, recordStatus, sortKey],
    [page, debouncedSearch, recordStatus, sortKey],
  );
  const { data, isLoading, error } = useFetchData<RecordQuery>(
    `/api/firearm/retrieve?page=${page}&search=${debouncedSearch}&filter=${recordStatus}&sortKey=${sortKey}`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

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
        {mockupData.length > 0 &&
          mockupData.map((totals, index: number) => (
            <StatisticCard {...totals} key={index} />
          ))}
      </div>
      <FireArmTable
        data={data?.record || []}
        totalPages={data?.totalPages || 0}
        isError={error}
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
