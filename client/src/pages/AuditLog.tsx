import AuditLogTable from "@/components/custom/AuditLogTable";
import CustomInput from "@/components/custom/CustomInput";
import PaginationButtons from "@/components/custom/PaginationButton";
import { Button } from "@/components/ui/button";
import { Search, SquareArrowOutUpRight } from "lucide-react";

const mockupData: IAuditLog[] = [
  {
    fullName: "John Doe",
    userName: "@jd-admin",
    status: "update",
    browser: "Chrome",
    ipAddress: "192.168.1.10",
    description: "**@jd-admin** updated a firearm record **#BR-21314**",
    recordSerialNumber: "FA-2024-001",
    isFireArmREcord: true,
    createdAt: "2024-01-10T08:30:00Z",
    updatedAt: "2024-01-10T09:00:00Z",
  },
  {
    fullName: "Maria Santos",
    userName: "@msantos",
    status: "register",
    browser: "Firefox",
    ipAddress: "192.168.1.15",
    description: "**@msantos** registered a new user account **@new-user01**",
    registeredUserName: "@new-user01",
    isFireArmREcord: false,
    createdAt: "2024-01-11T10:15:00Z",
  },
  {
    fullName: "Carlos Reyes",
    userName: "@creyes-mod",
    status: "delete",
    browser: "Edge",
    ipAddress: "10.0.0.21",
    description: "**@creyes-mod** deleted firearm record **#FA-2023-089**",
    recordSerialNumber: "FA-2023-089",
    isFireArmREcord: true,
    createdAt: "2024-01-12T14:45:00Z",
    updatedAt: "2024-01-12T15:00:00Z",
  },
  {
    fullName: "Anna Lim",
    userName: "@alim",
    status: "login",
    browser: "Safari",
    ipAddress: "172.16.0.5",
    description: "**@alim** logged into the system",
    isFireArmREcord: false,
    createdAt: "2024-01-13T07:20:00Z",
  },
  {
    fullName: "Michael Cruz",
    userName: "@mcruz-admin",
    status: "register",
    browser: "Chrome",
    ipAddress: "192.168.1.25",
    description:
      "**@mcruz-admin** registered a new firearm record **#FA-2024-014**",
    recordSerialNumber: "FA-2024-014",
    isFireArmREcord: true,
    createdAt: "2024-01-14T11:05:00Z",
    updatedAt: "2024-01-14T11:30:00Z",
  },
];

const AuditLog = () => {
  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-2 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <span className="text-gray-500 dark:text-gray-400">
          View and manage audit logs
        </span>
      </div>
      <div className="flex mb-2">
        <div className="flex gap-x-2 items-center ml-auto">
          <div className="mt-1">
            {/* Search Input */}
            <CustomInput
              icon={Search}
              placeholder="Search logs..."
              className="max-w-sm h-9 pl-9"
              iconClassName="top-2 left-2"
            />
          </div>
          <Button className="px-3">
            <SquareArrowOutUpRight />
            <span className="hidden md:inline">Export Logs</span>
          </Button>
        </div>
      </div>
      <AuditLogTable data={mockupData} />
      <PaginationButtons />
    </div>
  );
};

export default AuditLog;
