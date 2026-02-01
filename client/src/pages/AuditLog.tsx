import CustomInput from "@/components/custom/CustomInput";
import { Button } from "@/components/ui/button";
import { Search, SquareArrowOutUpRight } from "lucide-react";

const AuditLog = () => {
  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4 pb-[4.5rem] md:pb-0">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <span className="text-gray-500 dark:text-gray-400">
          View and manage audit logs
        </span>
      </div>
      <div className="flex">
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
    </div>
  );
};

export default AuditLog;
