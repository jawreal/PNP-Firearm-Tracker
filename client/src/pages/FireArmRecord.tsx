import FireArmTable from "@/components/custom/FireArmTable";
import StatisticCard from "@/components/custom/StatisticCard";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck,
  Package,
  AlertTriangle,
  FileX,
  type LucideIcon,
} from "lucide-react";

const sampleRecord: IFireArm[] = [
  {
    firstName: "John",
    lastName: "Doe",
    serialNumber: "BR-99021-X",
    fireArmType: "Glock 17",
    station: "North District",
    department: "Patrol",
    status: "issued",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    firstName: "Alice",
    lastName: "Jane",
    serialNumber: "CN-23021-X",
    fireArmType: "Dessert Eagle",
    station: "North District",
    department: "Patrol",
    status: "issued",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
}

const FireArmRecord = () => {
  const { data, isLoading, error } = useQuery<RecordQuery>({
    queryKey: ["firearm-records"],
    queryFn: async () => {
      const response = await fetch("/api/firearm/retrieve?page=1");
      if (!response.ok) {
        throw new Error("Failed to fetch firearm records");
      }
      const data = await response.json();
      return data;
    },
  });

  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Firearm Records</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all firearm records
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockupData.length > 0 &&
          mockupData.map((totals, index: number) => <StatisticCard {...totals} key={index} />)}
      </div>
      <FireArmTable data={data?.record || []} />
    </div>
  );
};

export default FireArmRecord;
