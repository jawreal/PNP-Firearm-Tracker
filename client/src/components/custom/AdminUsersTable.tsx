import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableRender from "./TableRender";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import FormatDate from "@/lib/dateFormatter";
import { Button } from "@/components/ui/button";
import { Check, Ellipsis, X } from "lucide-react";
import { useMemo, useState, useCallback, memo, Fragment } from "react";
import DeactivateAccDialog from "./DeactivateAccDialog";
import { Badge } from "../ui/badge";

interface IProps extends Omit<ITableRender, "dataLength"> {
  data: IAdminUsers[];
}

const AdminUsersTable = (props: IProps) => {
  const { data, ...rest } = props;
  const columnHelper = createColumnHelper<IAdminUsers>();
  const [openDeactivation, setOpenDeactivation] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUsers | null>(null);

  const onOpenDeactivation = useCallback((record: IAdminUsers) => {
    setSelectedUser(record);
    setOpenDeactivation(true);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => (
          <div className="flex flex-col">
            <span className="font-medium capitalize">
              {info.row.original.firstName} {info.row.original.lastName}
            </span>
            <span className="text-blue-700 dark:text-blue-600">
              {info.row.original.userName}
            </span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "dateAndTime",
        header: "Created At",
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
      columnHelper.accessor("status", {
        header: "Account Status",
        cell: (info) => {
          const status = info.getValue()?.toLowerCase();
          const Icon = status === "active" ? Check : X;
          return (
            <Badge
              variant={(status as "active" | "deactivated") ?? "default"}
              className="rounded-full gap-x-1 capitalize px-2 py-1"
            >
              {status ? (
                <Fragment>
                  {<Icon size={15} />}
                  {status}
                </Fragment>
              ) : (
                "No status found"
              )}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <div className="text-sm break-words md:min-w-52">
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
        header: () => <span className="mr-2">Action</span>,
        cell: (info) => {
          const record = info.row.original;
          return (
            <Button
              variant="ghost"
              size="icon"
              className="md:ml-10 [&_svg]:size-[20px] mr-3"
              onClick={() => onOpenDeactivation(record)}
            >
              <Ellipsis />
            </Button>
          );
        },
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable<IAdminUsers>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
      <DeactivateAccDialog
        user={selectedUser as IAdminUsers}
        open={openDeactivation}
        onOpenChange={setOpenDeactivation}
      />
      <TableRender table={table} dataLength={data?.length ?? 0} {...rest} />
    </div>
  );
};

export default memo(AdminUsersTable);
