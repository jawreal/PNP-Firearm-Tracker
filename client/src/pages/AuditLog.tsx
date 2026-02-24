import AuditLogTable from "@/components/custom/AuditLogTable";
import CustomInput from "@/components/custom/CustomInput";
import PaginationButtons from "@/components/custom/PaginationButton";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ListFilter,
  Search,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import CustomDropdown from "@/components/custom/CustomDropdown";

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

const filter: AuditStatus[] = [
  "register",
  "update",
  "delete",
  "login",
  "logout",
];

const sortOptions: string[] = [
  "user",
  "username",
  "status",
  "date & time",
  "browser",
  "IP address",
  "description",
];

const sortOptionMap: Record<string, keyof IAuditLog> = {
  user: "fullName",
  username: "userName",
  status: "status",
  "date & time": "createdAt",
  browser: "browser",
  "IP address": "ipAddress",
  description: "description",
}; // [key to display]: key for sorting in server

const AuditLog = () => {
  const [auditStatus, setAuditStatus] = React.useState<string>("Filter");
  const [sortKey, setSortKey] = React.useState<keyof IAuditLog | "Sort by">("Sort by");
  const [sortBy, setSortBy] = React.useState<string>("Sort by");

  const onSelectSortOption = React.useCallback((e?: Event | undefined) => {
    e?.preventDefault();
    const id = (e?.currentTarget as HTMLElement)?.id;
    const sortKey = sortOptionMap[id];
    setSortBy(id); // for displaying selected option
    setSortKey(sortKey); // setting sort by key to be sent to server
  }, []);

  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-1">
        <h1 className="text-2xl md:text-3xl font-medium">Audit Log</h1>
        <span className="text-gray-500 dark:text-gray-400">
          View and manage audit logs
        </span>
      </div>
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex mb-5 gap-x-2">
            <div>
              {/* Search Input */}
              <CustomInput
                icon={Search}
                placeholder="Search logs..."
                className="max-w-sm h-9 pl-9"
                iconClassName="top-2 left-2"
              />
            </div>
            <div className="flex gap-x-2 items-center ml-auto [&_span]:hidden [&_span]:md:inline">
              {/* sort by dropdown */}
              <CustomDropdown
                state={sortBy}
                onSelect={onSelectSortOption}
                options={sortOptions}
                icon={ArrowUpDown}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Sort by"
              />

              {/* filter dropdown */}
              <CustomDropdown
                state={auditStatus}
                setState={setAuditStatus}
                options={filter}
                icon={ListFilter}
                leftIcon={true}
                btnClassName="[&_span]:hidden [&_span]:md:inline"
                dropdownLabel="Filter by"
              />
              <Button className="px-3">
                <SquareArrowOutUpRight />
                <span>Export</span>
              </Button>
            </div>
          </div>
          <AuditLogTable data={mockupData} />
          <PaginationButtons />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLog;
