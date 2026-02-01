import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
} from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import TableRender from "./TableRender";

interface IProps {
  data: IAuditLog[];
}

const AuditLogTable = (props: IProps) => {
  const { data } = props;
  const columnHelper = createColumnHelper<IAuditLog>();
  const columns = [
    columnHelper.display({
      id: "user",
      header: "User",
      cell: (info) => (
        <div className="flex flex-col">
          <span>{info.row.original.fullName}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {info.row.original.userName}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <Badge
          variant="outline"
          className="rounded-full text-gray-500 dark:text-gray-400 capitalize"
        >
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <span className="capitalize break-words">{info.getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "dateAndTime",
      header: "Date & Time",
      cell: (info) => (
        <span className="capitalize truncate max-w-20">
          {info.row.original.createdAt}
        </span>
      ),
    }),
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
      <TableRender table={table} />
    </div>
  );
};

export default AuditLogTable;
