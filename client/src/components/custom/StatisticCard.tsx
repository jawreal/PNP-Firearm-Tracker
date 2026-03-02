import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface IDashboard {
  title: string;
  totalNumber: number;
  additionalDetail: string;
  icon: LucideIcon;
  minWidth?: string;
}

const DashboardCard = (props: IDashboard) => {
  const { title, totalNumber, additionalDetail, icon: Icon, minWidth } = props;

  return (
    <Card
      className={cn(
        "dark:bg-gray-950 shadow-none min-w-full flex flex-col gap-y-0 max-w-80 p-2",
        minWidth,
      )}
    >
      <CardHeader className="flex gap-x-3 p-4">
        <div className="w-full flex flex-col gap-y-3">
          <CardTitle className="text-sm font-normal text-gray-500 dark:text-gray-400 flex gap-x-2 items-center">
            {title}
          </CardTitle>
          <CardDescription className="text-3xl flex items-center font-medium text-black dark:text-gray-200 relative">
            <span className="font-bold">{totalNumber}</span>
            <div className="dark:bg-indigo-950/90 bg-indigo-200/80 rounded-lg p-3 absolute right-0">
              <Icon
                size={23}
                className="text-indigo-500 dark:text-indigo-400"
              />
            </div>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex gap-x-3 px-4 pt-0 pb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {additionalDetail ?? "Detail not found"}
        </span>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
