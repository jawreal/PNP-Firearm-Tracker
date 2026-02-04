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
import StatusDropdown from "@/components/custom/StatusDropdown";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProcessFireArm } from "@/services/processFireArm";
import { useForm, type SubmitHandler } from "react-hook-form";
import { RefreshCcw } from "lucide-react";

interface IRegisterFireArm extends IOpenChange {
  data?: IFireArm | null;
  isEdit?: boolean; // New prop to indicate edit mode
}

const RegisterFireArm = (props: IRegisterFireArm) => {
  const { open, onOpenChange, data, isEdit = false } = props;
  const [status, setStatus] = React.useState<FireArmStatus>(
    data?.status || "issued",
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<IFireArm>();

  const onSubmit: SubmitHandler<IFireArm> = React.useCallback(
    async (data) => {
      const finalized_data = {
        ...(isEdit && data?._id ? { firearm_id: data._id } : {}), // This checks if the data has _id in update mode.
        ...data,
        status,
      }; // Include the status
      const result = await ProcessFireArm(finalized_data, isEdit);
      if (result?.success) {
        reset();
        onOpenChange(false);
      }
      // Send the firearm to the server
    },
    [ProcessFireArm, status],
  );

  React.useEffect(() => {
    if (data && isEdit) {
      // Populate form fields with existing data for editing
      reset({
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        serialNumber: data?.serialNumber || "",
        fireArmType: data?.fireArmType || "",
        station: data?.station || "",
        department: data?.department || "",
      });
    } else {
      reset({
        firstName: "", // Clear the form fields
      });
    }
  }, [data, reset]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100%-2rem)] max-w-md rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <DialogTitle>
              {isEdit ? "Edit Registry" : "Register Firearm"}
            </DialogTitle>
            <DialogDescription>
              Kindly complete the required fields when registering a firearm.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 [&_label]:text-sm mt-4 mb-5">
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Juan"
                  {...register("firstName", {
                    required: true,
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Dela Cruz"
                  {...register("lastName", {
                    required: true,
                  })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="station">Station</Label>
              <Input
                id="station"
                placeholder="North District"
                {...register("station", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="Patrol"
                {...register("department", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-1 flex flex-col items-start">
              <Label htmlFor="status">Firearm Status</Label>
              <StatusDropdown status={status} setStatus={setStatus} />
            </div>
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-1">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  placeholder="BR-99021-X"
                  {...register("serialNumber", {
                    required: true,
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fireArmType">Type</Label>
                <Input
                  id="fireArmType"
                  placeholder="Glock 17"
                  {...register("fireArmType", {
                    required: true,
                  })}
                />
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
              {isSubmitting && <RefreshCcw className="animate-spin" />}
              {isSubmitting ? "Please wait..." : isEdit ? "Update" : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterFireArm;
