import FireArmTable from "@/components/custom/FireArmTable";
import StatisticCard from "@/components/custom/StatisticCard";
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
    status: "active",
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
    status: "active",
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

const FireArmRecord = () => {
  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Firearm Records</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all firearm records
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockupData.length > 0 &&
          mockupData.map((totals) => <StatisticCard {...totals} />)}
      </div>
      <FireArmTable data={sampleRecord} />
    </div>
  );
};

export default FireArmRecord;
