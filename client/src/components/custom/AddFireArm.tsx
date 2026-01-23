import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { IFireArm } from "@/components/custom/QRCodeDialog";
//import { InsertFirearm } from "../services/insertFirearm";

export interface IOpenChange {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddFireArm = (props: IOpenChange) => {
  const { open, onOpenChange } = props;
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFireArm>();
  /*const onSend = React.useCallback(async (data) => {
    
  }, []);*/
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-w-md rounded-lg">
          <DialogHeader className="text-left">
            <DialogTitle>Add Firearm</DialogTitle>
            <DialogDescription>
              Kindly complete the required fields when adding a firearm.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-3">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Enter first name" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Enter last name" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="station">Station</Label>
              <Input id="station" placeholder="Enter station" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Enter department" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="station">Firearm Status</Label>
              <Select>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Set status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Active</SelectItem>
                    <SelectItem value="banana">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-1">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input id="serialNumber" placeholder="Enter serial number" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fireArmType">Type</Label>
                <Input id="fireArmType" placeholder="Enter type" />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-x-3 md:gap-0 justify-end">
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              Add Firearm
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default AddFireArm;
