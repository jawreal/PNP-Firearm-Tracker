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
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Badge } from "../ui/badge";

interface IProps {
  data: IAdminUsers[];
}

const AdminUsersTable = (props: IProps) => {
  const { data } = props;
  const columnHelper = createColumnHelper<IAdminUsers>();

  const columns = [
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
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => (
        <Badge
          variant="outline"
          className="rounded-full text-gray-500 dark:text-gray-400 capitalize"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "action",
      header: "Action",
      cell: () => (
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-500 dark:text-gray-400 mr-2"
        >
          <Eye size={20} />
        </Button>
      ),
    }),
  ];

  const table = useReactTable<IAdminUsers>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border max-w-[62rem] shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
      <TableRender table={table} />
    </div>
  );
};

export default AdminUsersTable;
