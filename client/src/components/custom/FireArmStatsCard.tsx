import type { LucideIcon } from "lucide-react";
import { FIREARM_STATUS_STYLES } from "@/components/ui/badge";

interface StatsProp {
  title: string;
  totalNumber: number;
  icon: LucideIcon;
  statsKey: keyof typeof FIREARM_STATUS_STYLES;
}

const FireArmStatsCard = (props: StatsProp) => {
  const { title, totalNumber, icon: Icon, statsKey } = props;
  return (
    <div className="min-w-52 md:min-w-auto flex items-center gap-x-4 border border-gray-200 dark:border-gray-800 p-4 rounded-md">
      <div className={`rounded-full p-2 ${FIREARM_STATUS_STYLES[statsKey]}`}>
        <Icon size={18} />
      </div>
      <div className="flex flex-col gap-y-1">
        <span className="text-2xl font-bold">{totalNumber ?? 0}</span>
        <span className="font-medium text-sm text-gray-500 dark:text-gray-400">
          {title ?? "Title not found"}
        </span>
      </div>
    </div>
  );
};

export default FireArmStatsCard;
