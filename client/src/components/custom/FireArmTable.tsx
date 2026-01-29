import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useState } from "react";
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

interface IFireArmTable {
  data: IFireArm[];
}

const FireArmTable = ({ data }: IFireArmTable) => {
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
        <FireArmTableMenu onOpenRegisterFireArm={onOpenRegisterFireArm} />
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
          <Table>
            <TableHeader className="bg-gray-200/50 dark:bg-gray-900/50">
              <TableRow className="[&_th]:text-gray-600 [&_th]:font-medium dark:[&_th]:text-gray-400 px-2">
                <TableHead>Serial Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Firearm Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>
                  <span className="md:ml-10">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((record: IFireArm, idx: number) => (
                <TableRow
                  key={idx}
                  className="[&_td]:py-3 [&_td]:max-w-52 [&_td]:min-w-44 [&_td]:md:max-w-32 [&_td]:md:min-w-32"
                >
                  <TableCell>
                    <span className="font-medium">{record.serialNumber}</span>
                  </TableCell>
                  <TableCell>
                    <span className="py-2">
                      {record.firstName} {record.lastName}
                    </span>
                  </TableCell>
                  <TableCell>{record.fireArmType}</TableCell>
                  <TableCell className="md:min-w-20">
                    <Badge
                      variant="outline"
                      className="rounded-full text-gray-500 dark:text-gray-400 capitalize"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.station}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="md:ml-10 text-gray-500 dark:text-gray-400 [&_svg]:size-[20px]"
                        >
                          <EllipsisVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={() => onOpenRegisterFireArm(record, true)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onOpenQRCodeDialog(record)}
                          >
                            View QR
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onOpenDeleteDialog(record)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <PaginationButtons />
      </CardContent>
    </Card>
  );
};

export default FireArmTable;
