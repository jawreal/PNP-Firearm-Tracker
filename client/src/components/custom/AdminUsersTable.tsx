import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TableRender from "./TableRender";
import { format } from "date-fns";
import FormatDate from "@/lib/dateFormatter";
import { Button } from "@/components/ui/button";
import { Check, Ellipsis, X } from "lucide-react";
import { useMemo, useState, useCallback, memo, Fragment } from "react";
import DeactivateAccDialog from "./DeactivateAccDialog";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import AssignRole from "./AssignRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface IProps extends Omit<ITableRender, "dataLength"> {
  data: IAdminUsers[];
}

const AdminUsersTable = (props: IProps) => {
  const { data, ...rest } = props;
  const columnHelper = createColumnHelper<IAdminUsers>();
  const [openDeactivation, setOpenDeactivation] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<IAdminUsers | null>(null);
  const [openAssignRole, setOpenAssignRole] = useState<boolean>(false);

  const onOpenDeactivation = useCallback((record: IAdminUsers) => {
    setSelectedUser(record);
    setOpenDeactivation(true);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "user",
        header: "User",
        cell: (info) => {
          const fullName: string = `${info.row.original.firstName} ${info.row.original.lastName}`;
          return (
            <div className="flex gap-x-3 py-2 items-center break-words">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${fullName}`}
                className="w-7 h-7 rounded-full"
              />
              <div className="flex flex-col w-full pr-2">
                <span className="font-medium capitalize">
                  {info.row.original.firstName} {info.row.original.lastName}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                  {info.row.original.emailAddress}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("role", {
        header: () => <span className="pl-2">Role</span>,
        cell: (info) => {
          const role = info.row.original?.role;
          return (
            <div className="flex flex-col pl-2">
              <span
                className={cn(
                  `text-sm flex gap-x-2 items-center text-blue-600 dark:text-blue-500 capitalize`,
                  role === "admin" && "text-emerald-600 dark:text-emerald-500",
                )}
              >
                <span
                  className={cn(
                    "w-2 h-2 block rounded-full bg-blue-500 dark:bg-blue-600",
                    role === "admin" && "bg-emerald-500 dark:bg-emerald-600",
                  )}
                ></span>{" "}
                {role === "super-admin" ? "head admin" : role}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "dateAndTime",
        header: "Added by",
        cell: (info) => {
          const addedBy: string =
            info.row.original?.addedBy ?? "User not found";
          if (addedBy === "default_admin") {
            return <span>—</span>;
          }
          const date = FormatDate(info.row.original.createdAt);
          if (!date) {
            return <span>—</span>;
          }
          const createdAt = format(date, "MMM d, yyyy");
          return (
            <div className="flex gap-x-3 py-2 items-center break-words">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${addedBy}`}
                className="w-7 h-7 rounded-full"
              />
              <div className="flex flex-col w-full pr-2">
                <span className="font-medium capitalize">{addedBy}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                  {createdAt}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Account status",
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
      columnHelper.accessor("deactivatedBy", {
        header: "Deactivated by",
        cell: (info) => {
          const date = FormatDate(info.row.original.deactivatedAt);
          if (!date) {
            return <span>—</span>;
          }
          const deactivatedAt = format(date, "MMM d, yyyy");
          const deactivatedBy: string =
            info.row.original?.deactivatedBy ?? "User not found";
          return (
            <div className="flex gap-x-3 py-2 items-center break-words">
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${deactivatedBy}`}
                className="w-7 h-7 rounded-full"
              />
              <div className="flex flex-col w-full pr-2">
                <span className="font-medium capitalize">{deactivatedBy}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
                  {deactivatedAt}
                </span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="mr-2">Action</span>,
        cell: (info) => {
          const role = info.row.original.role;
          const record = info.row.original;
          if (role !== "admin") {
            return <span className="px-6">—</span>;
          }
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:ml-10 text-gray-500 dark:text-gray-400 [&_svg]:size-[20px] mr-3"
                >
                  <Ellipsis size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className="text-gray-500 dark:text-gray-400 font-medium">
                  Actions
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onOpenDeactivation(record)}>
                    Change Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpenAssignRole(record)}>
                    Edit Role
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
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

  const onOpenAssignRole = useCallback((record: IAdminUsers) => {
    setSelectedUser(record);
    setOpenAssignRole((state) => !state);
  }, []);

  return (
    <div className="rounded-md border shadow-sm border-gray-200 dark:border-gray-800 overflow-hidden">
      <AssignRole
        open={openAssignRole}
        onOpenChange={setOpenAssignRole}
        data={selectedUser}
      />
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
