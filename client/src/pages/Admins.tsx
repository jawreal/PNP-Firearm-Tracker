import AdminUsersTable from "@/components/custom/AdminUsersTable";
import CustomInput from "@/components/custom/CustomInput";
import {
  Plus,
  Search,
  SlidersHorizontal,
  SquareArrowOutUpRight,
} from "lucide-react";
import AdminStatDropdown from "@/components/custom/CustomDropdown";
import { Button } from "@/components/ui/button";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import PaginationButtons from "@/components/custom/PaginationButtons";

const mockupData: IAdminUsers[] = [
  {
    fullName: "John Doe",
    userName: "@jd_123",
    createdAt: "2024-01-14T11:05:00Z",
    role: "admin",
    status: "active",
    description: "Added by other administrator **@mcruz-admin**",
  },
];

const ACCOUNT_STATUS: AdminAccStatus[] = ["deactivated", "active"];

const Admins = () => {
  const [auditStatus, setAuditStatus] = React.useState<string>("Filter");
  return (
    <div className="w-full max-w-[65rem] gap-y-5 flex flex-col pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Admins</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all admin users
        </span>
      </div>

      <Card className="p-0">
        <CardContent className="p-4">
          <div className="w-full flex gap-x-2 mb-5">
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
              <AdminStatDropdown
                state={auditStatus}
                setState={setAuditStatus}
                options={ACCOUNT_STATUS}
                icon={SlidersHorizontal}
                btnWidth="[&_span]:hidden [&_span]:inline"
              />
              <Button className="px-3" variant="outline">
                <SquareArrowOutUpRight />
                <span>Export Logs</span>
              </Button>
              <Button className="px-3">
                <Plus />
                <span>Register Admin</span>
              </Button>
            </div>
          </div>
          <AdminUsersTable data={mockupData} />
          <PaginationButtons />
        </CardContent>
      </Card>
    </div>
  );
};

export default Admins;
