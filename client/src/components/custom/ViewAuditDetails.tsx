import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormatDate from "@/lib/dateFormatter";
import { format } from "date-fns";
import { useMemo, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IProps {
  children: ReactNode;
  record: IAuditLog;
}

const ViewAuditDetails = (props: IProps) => {
  const { children, record } = props;

  const date = useMemo(() => FormatDate(record.createdAt), []);

  const formattedDate = useMemo(() => {
    if (!date) return {};
    return {
      createdAt: format(date, "MMM d, yyyy"),
      time: format(date, "hh:mm a"),
    };
  }, [date]);

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-md md:rounded-lg">
        <DialogHeader className="text-left">
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>
            View complete details of audit log record
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 border rounded-xl p-4 bg-gray-100/60 dark:bg-gray-900/60 dark:border-gray-800">
          <div className="grid grid-cols-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Fullname
              </span>
              <p className="text-sm font-medium">
                {`${record?.fullName ?? "Not found"}`}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Username
              </span>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-600">
                {`${record?.userName ?? "Not found"}`}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Date
              </span>
              <p className="text-sm font-medium">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formattedDate?.createdAt ?? "Date not found"}
                  </span>
                </div>
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Time
              </span>
              <p className="text-sm font-medium">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {formattedDate?.time ?? "Date not found"}
                  </span>
                </div>
              </p>
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Status
            </span>
            <p className="text-sm font-medium">{`${record?.status ?? ""}`}</p>
          </div>
          <div className="grid grid-cols-2">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Browser
              </span>
              <p className="text-sm font-medium">
                {`${record?.browser ?? ""}`}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                IP Adress
              </span>
              <p className="text-sm font-medium">
                {record?.ipAddress ?? "not found"}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Description
            </span>
            <p className="text-sm font-medium">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  strong: ({ ...props }) => (
                    <strong
                      {...props}
                      className="font-medium text-blue-700 dark:text-blue-600"
                    />
                  ),
                }}
              >
                {record?.description ?? "Description not found"}
              </ReactMarkdown>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAuditDetails;
