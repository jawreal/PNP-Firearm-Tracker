import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface IDashboard {
  totalName: string;
  totalNumber: number;
  icon: LucideIcon;
  minWidth?: string;
  showSeeDetails?: boolean;
}

const roles: string[] = ["admin", "moderator", "contributor"];

const DashboardCard = (props: IDashboard) => {
  const {
    totalName,
    totalNumber,
    icon: Icon,
    minWidth,
    showSeeDetails = false,
  } = props;
  const linkRole = useMemo(
    () => roles.filter((role) => window.location.pathname.includes(role)),
    [],
  );
  const linkName = useMemo(() => {
    const linkName = (totalName as string)?.split(" ");
    return `/${linkRole[0]}/${linkName[1]}`;
  }, [totalName, linkRole]);

  return (
    <Card
      className={cn(
        "min-w-full flex flex-col gap-y-0 max-w-80 p-0 dark:bg-gray-900/50",
        minWidth,
        showSeeDetails && "p-1",
      )}
    >
      <CardHeader className="flex gap-x-3 p-4">
        <div className="w-full flex flex-col">
          <CardTitle className="text-xs font-medium text-gray-400 dark:text-gray-500 flex gap-x-2 items-center">
            <Icon size={17} className="text-gray-500 dark:text-gray-200" />
            {totalName}
          </CardTitle>
          <CardDescription
            className={`text-3xl font-medium text-black dark:text-gray-200 ${showSeeDetails ? "mt-3" : "mt-6"}`}
          >
            {totalNumber}
          </CardDescription>
        </div>
      </CardHeader>
      {showSeeDetails && (
        <CardContent className="flex gap-x-3 py-2 px-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={linkName.toLowerCase()}
            className="text-xs dark:text-gray-200"
          >
            See details
          </Link>
          <ArrowRight size={15} className="text-gray-400 dark:text-gray-200" />
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardCard;
