import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import TableRender from "@/components/custom/TableRender";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import ViewAuditDetails from "./ViewAuditDetails";
import FormatDate from "@/lib/dateFormatter";
import { useMemo, useState, memo, useCallback, Fragment } from "react";
import StatusIcons from "@/lib/statusIcon";

interface IProps {
  data: IAuditLog[];
}

const AuditLogTable = (props: IProps) => {
  const { data } = props;
  const [selectedRecord, setSelectedRecord] = useState<IAuditLog | null>(null);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const columnHelper = createColumnHelper<IAuditLog>();

  const onSelectRecord = useCallback((record: IAuditLog) => {
    setSelectedRecord(record);
    setOpenDetails(true);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium">{info.row.original.fullName}</span>
            <span className="text-blue-700 dark:text-blue-600">
              {info.row.original.userName}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const Icon = StatusIcons("auditLog", value);
          return (
            <Badge
              variant={(value?.toLowerCase() ?? "default") as FireArmStatus}
              className="rounded-full gap-x-1 capitalize p-2"
            >
              {info.getValue() ? (
                <Fragment>
                  {<Icon size={15} />}
                  {info.getValue()}
                </Fragment>
              ) : (
                "No status found"
              )}
            </Badge>
          );
        },
      }),
      columnHelper.display({
        id: "dateAndTime",
        header: "Date & Time",
        cell: (info) => {
          const date = FormatDate(info.row.original.createdAt);
          if (!date) {
            return <span>Missing date</span>;
          }
          const createdAt = format(date, "MMM d, yyyy");
          const time = format(date, "hh:mm a");
          return (
            <div className="flex flex-col">
              <span className="font-medium">{createdAt}</span>
              <span className="capitalize truncate max-w-20 text-gray-500 dark:text-gray-400">
                {time}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "browserAndIp",
        header: "Browser & IP",
        cell: (info) => {
          const ip = info.row.original.ipAddress;
          const browser = info.row.original.browser;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{browser}</span>
              <span className="text-gray-500 dark:text-gray-400">{ip}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <div className="text-sm break-words min-w-52">
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
              {info.getValue()}
            </ReactMarkdown>
          </div>
        ),
      }),
      columnHelper.display({
        id: "action",
        header: "Action",
        cell: (info) => (
          <Button
            size="icon"
            variant="ghost"
            className="text-gray-500 dark:text-gray-400 mr-2"
            onClick={() => onSelectRecord(info.row.original)}
          >
            <Eye size={20} />
          </Button>
        ),
      }),
    ],
    [columnHelper],
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
      <ViewAuditDetails
        record={selectedRecord}
        open={openDetails}
        onOpenChange={setOpenDetails}
      />
      <TableRender table={table} />
    </div>
  );
};

export default memo(AuditLogTable);
