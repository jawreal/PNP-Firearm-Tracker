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

interface IFireArmTable {
  data: IFireArm[];
  isLoading: boolean;
  isError: Error | null;
  setPage: Dispatch<SetStateAction<number>>;
  currentPage: number;
  hasNextPage?: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

const FireArmTable = ({
  data,
  search,
  setSearch,
  isError,
  setPage,
  isLoading,
  hasNextPage,
  currentPage,
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
      columnHelper.accessor("serialNumber", {
        header: "Serial Number",
        cell: (info) => (
          <span className="font-medium">{info.getValue() ?? "Not found"}</span>
        ),
      }),
      columnHelper.accessor(
        (row) => `${row?.firstName ?? "Unknown"} ${row.lastName ?? ""}`,
        {
          id: "owner",
          header: "Owner",
          cell: (info) => <span className="py-2">{info.getValue()}</span>,
        },
      ),
      columnHelper.accessor("fireArmType", {
        header: "Firearm Type",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <Badge
            variant="outline"
            className="rounded-full text-gray-500 dark:text-gray-400"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("station", {
        header: "Station",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => info.getValue(),
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
          itemName={
            selectedFireArm?.firstName + " " + selectedFireArm?.lastName ||
            "Unknown"
          }
          item_id={selectedFireArm?.serialNumber || ""}
        />

        {/* Firearm Records Table */}
        <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          {!isLoading ? (
            isError ? (
              <ErrorFallback />
            ) : (
              <TableRender table={table} />
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
          />
        )}
      </CardContent>
    </Card>
  );
};

export default memo(FireArmTable);
