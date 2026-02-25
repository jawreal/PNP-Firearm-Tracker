import useFetchData from "@/hooks/useFetchData";
import { ShieldCheck, Archive, UserX, UserMinus } from "lucide-react";
import { useMemo } from "react";
import StatisticCard from "@/components/custom/StatisticCard";

const STATS_DATA: Record<string, StatsType> = {
  totalActive: {
    title: "Active Firearms",
    icon: ShieldCheck,
    additionalDetail: "Assigned",
  },
  totalArchive: {
    title: "Archived Firearms",
    icon: Archive,
    additionalDetail: "In storage",
  },
  totalActiveAcc: {
    title: "Active Accounts",
    icon: UserMinus,
    additionalDetail: "Currently enabled",
  },
  totalDeactivatedAcc: {
    title: "Deactivated Accounts",
    icon: UserX,
    additionalDetail: "Access disabled",
  },
};

const Dashboard = () => {
  const queryKey = useMemo(() => ["dashboard-stats"], []);
  const { data, isLoading } = useFetchData<
    RecordQuery<{
      statistics: Record<string, number>;
    }>
  >(
    `/api/dashboard/retrieve/stats`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

  return (
    <div className="w-full max-w-[80rem] flex flex-col pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl md:text-3xl font-medium">Dashboard</h1>
        <span className="text-gray-500 dark:text-gray-400">
          See all record statistics
        </span>
      </div>
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 mt-5">
          {data?.statistics?.map((stat, index: number) => {
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
      )}
    </div>
  );
};

export default Dashboard;
