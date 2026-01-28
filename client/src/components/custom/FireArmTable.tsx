import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SquareArrowOutUpRight,
  Plus,
  Search,
  EllipsisVertical,
  ScanLine,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomInput from "@/components/custom/CustomInput";
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
import QRCodeDialog from "./QRCodeDialog";

const sampleRecord: IFireArm[] = [
  {
    firstName: "John",
    lastName: "Doe",
    serialNumber: "BR-99021-X",
    fireArmType: "Glock 17",
    station: "North District",
    department: "Patrol",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface IFireArmTable {
  data: IFireArm[];
}

const FireArmTable = ({ data = sampleRecord }: IFireArmTable) => {
  const [openRegisterFireArm, setOpenRegisterFireArm] =
    useState<boolean>(false);
  const [openQRCodeDialog, setOpenQRCodeDialog] = useState<boolean>(false);
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

  return (
    <div className="w-full max-w-[65rem] flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-0">
        <h1 className="text-2xl font-bold">Firearm Records</h1>
        <span className="text-gray-500 dark:text-gray-400">
          Manage all firearm records
        </span>
      </div>
      <Card className="w-full rounded-xl border border-gray-300 dark:border-gray-800">
        <CardHeader className="px-5 py-3 flex flex-row gap-x-2 items-center">
          <div className="hidden">
            {/* CardTitle and CardDescription are required when using CardHeader and it causes error if they're not used*/}
            {/* They are hidden since we don't need to show them */}
            <CardTitle />
            <CardDescription />
          </div>
          <div className="mt-1">
            {/* Search Input */}
            <CustomInput
              icon={Search}
              placeholder="Search firearm..."
              className="max-w-sm h-9 pl-9"
              iconClassName="top-2 left-2"
            />
          </div>
          <div className="ml-auto flex gap-x-2 items-center">
            {/* QR Search Button */}
            <Button variant="outline" className="px-3">
              <ScanLine />
              <span className="hidden md:inline">QR Search</span>
            </Button>
            {/* Export and Register Firearm Buttons */}
            <Button variant="outline" className="px-3">
              <SquareArrowOutUpRight />
              <span className="hidden md:inline">Export Firearms</span>
            </Button>
            {/* Register Firearm Button */}
            <Button className="px-3" onClick={() => onOpenRegisterFireArm()}>
              <Plus />
              <span className="hidden md:inline">Register Firearm</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 mt-3">
          {/* Register Firearm Dialog */}
          <RegisterFireArm
            open={openRegisterFireArm}
            onOpenChange={setOpenRegisterFireArm}
            {...(isEdit ? { data: selectedFireArm, isEdit } : {})}
          />

          {/* Registry Detail Sheet */}
          <QRCodeDialog
            open={openQRCodeDialog}
            onOpenChange={setOpenQRCodeDialog}
            data={selectedFireArm as IFireArm}
          />

          {/* Firearm Records Table */}
          <div className="rounded-md border border-gray-200 dark:border-gray-800 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-200/50 dark:bg-gray-900/80">
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
                    className="[&_td]:py-3 [&_td]:max-w-52 [&_td]:min-w-52 [&_td]:md:max-w-32 [&_td]:md:min-w-32"
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
                              onClick={() =>
                                onOpenRegisterFireArm(record, true)
                              }
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
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FireArmTable;
