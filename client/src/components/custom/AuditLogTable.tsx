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
import {
  useMemo,
  useState,
  memo,
  useCallback,
  Fragment,
  type Dispatch,
  type SetStateAction,
} from "react";
import StatusIcons from "@/lib/statusIcon";
import { cn } from "@/lib/utils";

interface IProps extends Omit<ITableRender, "dataLength"> {
  data: IAuditLog[];
  expanded: IExpanded;
  setExpanded: Dispatch<SetStateAction<IExpanded>>;
}

const AuditLogTable = (props: IProps) => {
  const { data, expanded, setExpanded, ...rest } = props;
  const [selectedRecord, setSelectedRecord] = useState<IAuditLog | null>(null);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const columnHelper = createColumnHelper<IAuditLog>();

  const onSelectRecord = useCallback((record: IAuditLog) => {
    setSelectedRecord(record);
    setOpenDetails(true);
  }, []);

  const onExpand = useCallback(
    (row_id: string) => {
      setExpanded({
        id: row_id,
        state: expanded.state ? false : true,
      });
    },
    [setExpanded, expanded],
  );

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex gap-x-2 items-center">
            <img
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${info.row.original.fullName}`}
              className="w-7 h-7 rounded-full"
            />
            <div className="flex flex-col">
              <span className="font-medium">{info.row.original.fullName}</span>
              <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                {info.row.original.emailAddress}
              </span>
            </div>
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
              className="rounded-full gap-x-1 capitalize px-2 py-1"
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
        cell: (info) => {
          const row_id = info.row.original?._id;
          return (
            <div className="text-sm min-w-52 relative">
              <div
                className={cn(
                  expanded.id === row_id && expanded.state
                    ? "line-clamp-2"
                    : "",
                )}
              >
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

              <Button
                variant="ghost"
                onClick={() => onExpand(row_id ?? "uknown")}
                className="p-0 h-0 text-blue-700 dark:text-blue-400 text-xs right-0 bottom-0 inline-block"
              >
                {expanded.id === row_id && expanded.state
                  ? "See less"
                  : "See more"}
              </Button>
            </div>
          );
        },
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
    [columnHelper, expanded, setExpanded],
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
      <TableRender table={table} dataLength={data?.length ?? 0} {...rest} />
    </div>
  );
};

export default memo(AuditLogTable);
