import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisIcon } from "lucide-react";
import {
  useCallback,
  useState,
  useMemo,
  memo,
  type Dispatch,
  type SetStateAction,
  Fragment,
} from "react";
import RegisterFireArm from "@/components/custom/RegisterFireArm";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QRCodeDialog from "@/components/custom/QRCodeDialog";
import FireArmTableMenu from "@/components/custom/FireArmTableMenu";
import PaginationButtons from "@/components/custom/PaginationButton";
import DeleteItemDialog from "@/components/custom/DeleteItemDialog";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  ErrorFallback,
  TableSkeleton,
} from "@/components/custom/TableFallback";
import TableRender from "@/components/custom/TableRender";
import StatusIcons from "@/lib/statusIcon";
import FormatDate from "@/lib/dateFormatter";
import { format } from "date-fns";

interface IFireArmTable {
  data: IFireArm[];
  isLoading: boolean;
  isError: Error | null;
  setPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  hasNextPage?: boolean;
  search: string;
  totalPages: number;
  setSearch: Dispatch<SetStateAction<string>>;
  filter: FireArmStatus | "Filter";
  setFilter: Dispatch<SetStateAction<FireArmStatus | "Filter">>;
  setSortKey: Dispatch<SetStateAction<ISortOption>>;
}

const FireArmTable = ({
  data,
  search,
  setSearch,
  isError,
  setPage,
  isLoading,
  totalPages,
  hasNextPage,
  currentPage,
  filter,
  setFilter,
  setSortKey,
}: IFireArmTable) => {
  const columnHelper = createColumnHelper<IFireArm>();
  const [openRegisterFireArm, setOpenRegisterFireArm] =
    useState<boolean>(false);
  const [openQRCodeDialog, setOpenQRCodeDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedFireArm, setSelectedFireArm] = useState<IFireArm | null>(null);

  /* Open Register Firearm Dialog */
  const onOpenRegisterFireArm = useCallback(
    (record?: IFireArm, isEdit?: boolean) => {
      setOpenRegisterFireArm(true);
      if (record) {
        setSelectedFireArm(record);
      }
      setIsEdit(isEdit ?? false);
    },
    [],
  );

  const onOpenQRCodeDialog = useCallback((record: IFireArm) => {
    setSelectedFireArm(record);
    setOpenQRCodeDialog(true);
  }, []);

  const onOpenDeleteDialog = useCallback((record: IFireArm) => {
    setSelectedFireArm(record);
    setOpenDeleteDialog(true);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "serialAndType",
        header: "Serial & Type",
        cell: (info) => {
          const serialNumber = info.row.original.serialNumber;
          const fireArmType = info.row.original.fireArmType;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{serialNumber}</span>
              <span className="capitalize text-gray-500 dark:text-gray-400">
                {fireArmType}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("fullName", {
        header: "Firearm Owner",
        cell: (info) => (
          <span className="py-2 font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const value = info.getValue();
          const Icon = StatusIcons("firearmRecord", value);
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
        id: "stationAndDep",
        header: "Station & Department",
        cell: (info) => {
          const station = info.row.original.station;
          const department = info.row.original.department;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{station}</span>
              <span className="capitalize truncate max-w-20 text-gray-500 dark:text-gray-400">
                {department}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
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
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: (info) => {
          const updatedAt = FormatDate(info.row.original.updatedAt);
          const createdAt = FormatDate(info.row.original.createdAt);
          if (!updatedAt || !createdAt) {
            return <span>Missing date</span>;
          }
          const normalizedDate = format(updatedAt, "MMM d, yyyy");
          const time = format(updatedAt, "hh:mm a");
          const isNotUpdated = updatedAt?.getTime() === createdAt?.getTime();
          return isNotUpdated ? (
            <span>—</span>
          ) : (
            <div className="flex flex-col">
              <span className="font-medium">{normalizedDate}</span>
              <span className="capitalize truncate max-w-20 text-gray-500 dark:text-gray-400">
                {time}
              </span>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <span className="mr-2">Action</span>,
        cell: (info) => (
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
                <DropdownMenuItem
                  onClick={() => onOpenRegisterFireArm(info.row.original, true)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onOpenQRCodeDialog(info.row.original)}
                >
                  View QR
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onOpenDeleteDialog(info.row.original)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable<IFireArm>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="w-full rounded-xl border border-gray-300 dark:border-gray-800">
      <CardHeader className="px-5 py-3 flex flex-row gap-x-2 items-center">
        <div className="hidden">
          {/* CardTitle and CardDescription are required when using CardHeader and it causes error if they're not used*/}
          {/* They are hidden since we don't need to show them */}
          <CardTitle />
          <CardDescription />
        </div>

        {/* Firearm Table Menu */}
        <FireArmTableMenu
          onOpenRegisterFireArm={onOpenRegisterFireArm}
          table={table}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          setSortKey={setSortKey}
        />
      </CardHeader>
      <CardContent className="px-5 mt-3">
        {/* Register Firearm Dialog */}
        <RegisterFireArm
          open={openRegisterFireArm}
          onOpenChange={setOpenRegisterFireArm}
          {...(isEdit ? { data: selectedFireArm, isEdit } : {})}
        />

        {/* QR Code Dialog */}
        <QRCodeDialog
          open={openQRCodeDialog}
          onOpenChange={setOpenQRCodeDialog}
          data={selectedFireArm as IFireArm}
        />

        {/* Delete Dialog */}
        <DeleteItemDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          itemName={selectedFireArm?.fullName || "Unknown"}
          item_id={selectedFireArm?.serialNumber || ""}
        />

        {/* Firearm Records Table */}
        <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          {!isLoading ? (
            isError ? (
              <ErrorFallback
                {...(search?.length > 0 && {
                  description: "No results found for the given search query.",
                })}
              />
            ) : data.length === 0 ? (
              <ErrorFallback>
                {search?.length > 0 ? (
                  <span>
                    No results found for the given search{" "}
                    <span className="font-medium text-black">{search}</span>
                  </span>
                ) : (
                  <span>No entries to show. Create a record or adjust the filter settings.</span>
                )}
              </ErrorFallback>
            ) : (
              <TableRender table={table} hasFixedSize={false} />
            )
          ) : (
            <TableSkeleton />
          )}
        </div>
        {!isError && (
          <PaginationButtons
            setPage={setPage}
            hasNextPage={hasNextPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default memo(FireArmTable);
