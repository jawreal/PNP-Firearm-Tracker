import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight, Plus, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomInput from "./CustomInput";

const sampleRecord: IFireArm = {
  firstName: "John",
  lastName: "Doe",
  serialNumber: "BR-99021-X",
  fireArmType: "Glock 17",
  station: "North District",
  department: "Patrol",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const FireArmTable = () => {
  return (
    <Card className="w-full max-w-[65rem]">
      <CardHeader className="px-5 py-3 flex flex-row gap-x-2 items-center">
        <div className="hidden">
          {/* CardTitle and CardDescription are required when using CardHeader and it causes error if they're not used*/}
          {/* They are hidden since we don't need to show them */}
          <CardTitle />
          <CardDescription />
        </div>
        <div className="mt-1">
          <CustomInput
            icon={Search}
            placeholder="Search firearm..."
            className="max-w-sm h-9 pl-9"
            iconClassName="top-2 left-2"
          />
        </div>
        <div className="ml-auto flex gap-x-2 items-center">
          <Button variant="outline" className="px-3">
            <SquareArrowOutUpRight />
            <span className="hidden md:inline">Export Firearms</span>
          </Button>
          <Button className="px-3">
            <Plus />
            <span className="hidden md:inline">Register Firearm</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead>Full name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Firearm Type</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={sampleRecord.firstName}>
              <TableCell>
                {sampleRecord.firstName} {sampleRecord.lastName}
              </TableCell>
              <TableCell>{sampleRecord.serialNumber}</TableCell>
              <TableCell>{sampleRecord.fireArmType}</TableCell>
              <TableCell>{sampleRecord.station}</TableCell>
              <TableCell>{sampleRecord.department}</TableCell>
              <TableCell>{sampleRecord.status}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FireArmTable;
