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
import { EllipsisIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    columnHelper.display({
      id: "roleAndStatus",
      header: "Role & Status",
      cell: (info) => {
        const role = info.row.original.role;
        const status = info.row.original.status;
        return (
          <div className="flex flex-col">
            <span className="font-medium capitalize">{role}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              {status}
            </span>
          </div>
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
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:ml-10 text-gray-500 dark:text-gray-400 [&_svg]:size-[20px] mr-3"
            >
              <EllipsisIcon size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Details</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Deactivate</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const table = useReactTable<IAdminUsers>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
      <TableRender table={table} />
    </div>
  );
};

export default AdminUsersTable;
