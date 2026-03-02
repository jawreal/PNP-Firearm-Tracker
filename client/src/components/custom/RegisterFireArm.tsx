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
import StatusDropdown from "@/components/custom/CustomDropdown";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ProcessFireArm } from "@/services/processFireArm";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { ChevronDown, RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface IRegisterFireArm extends IOpenChange {
  data?: IFireArm | null;
  isEdit?: boolean; // New prop to indicate edit mode
}

const options: FireArmStatus[] = [
  "issued",
  "stocked",
  "loss",
  "disposition",
  "turn in",
]; // For status dropdown

const RegisterFireArm = (props: IRegisterFireArm) => {
  const queryClient = useQueryClient();
  const { open, onOpenChange, data, isEdit } = props;
  const [status, setStatus] = React.useState<FireArmStatus>(
    data?.status || "issued",
  );
  const [prevData, setPrevData] = React.useState<IFireArm | null>(null);
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<IFireArm>();
  const allFields = useWatch<IFireArm>({
    control,
  });

  const hasChanged = React.useMemo(() => {
    if (!prevData || !allFields) {
      return false;
    }
    return Object.keys(allFields).some((field_key) => {
      const allFieldsValue = allFields[field_key as keyof IFireArm];
      const prevDataValue = prevData[field_key as keyof IFireArm];
      if (
        typeof allFields === "boolean" &&
        typeof prevDataValue === "boolean" // checks if the value is boolean
      ) {
        return allFieldsValue !== prevDataValue;
      }
      return (
        (allFieldsValue as string)?.trim() !== (prevDataValue as string)?.trim() // trim the value when checking if it's string
      );
    });
  }, [allFields, prevData]);

  const onSubmit: SubmitHandler<IFireArm> = React.useCallback(
    async (data) => {
      const finalized_data = {
        ...(isEdit && data?._id
          ? {
              firearm_id: data._id,
              ...(prevData?.serialNumber?.trim() !== data?.serialNumber?.trim()
                ? { serialNumber: data?.serialNumber }
                : {}), // This checks if the serial number has changed to avoid error because serial number is unique field
            }
          : {}), // This checks if the data has _id in update mode.
        ...data,
        status,
      }; // Include the status
      const result = await ProcessFireArm(finalized_data, isEdit);
      if (result?.success) {
        reset();
        onOpenChange(false);
        setPrevData(null);
        queryClient.invalidateQueries({ queryKey: ["firearm-records"] });
      }
      // Send the firearm to the server
    },
    [
      ProcessFireArm,
      status,
      isEdit,
      reset,
      onOpenChange,
      queryClient,
      prevData,
    ],
  );

  React.useEffect(() => {
    if (data && isEdit) {
      // Populate form fields with existing data for editing
      reset({
        fullName: data?.fullName || "",
        serialNumber: data?.serialNumber || "",
        fireArmType: data?.fireArmType || "",
        station: data?.station || "",
        department: data?.department || "",
        _id: data?._id || "", // Include the _id for reference in update
      });
      setPrevData(data ?? null);
    } else {
      reset({
        fullName: "", // Clear the form fields
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
            <div className="space-y-1">
              <Label htmlFor="fullName">Firearm Owner</Label>
              <Input
                id="fullName"
                placeholder="e.g., PSSg. Juan Dela Cruz Jr."
                {...register("fullName", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="station">Station</Label>
              <Input
                id="station"
                placeholder="e.g., North District"
                {...register("station", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                placeholder="e.g., Patrol"
                {...register("department", {
                  required: true,
                })}
              />
            </div>
            <div className="space-y-1 flex flex-col items-start">
              <Label htmlFor="status">Firearm Status</Label>
              <StatusDropdown
                state={status}
                setState={setStatus}
                options={options}
                icon={ChevronDown}
                btnClassName="w-40 capitalize"
                dropdownWidth="w-40"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-3">
              <div className="space-y-1">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  placeholder="e.g., BR-99021-X"
                  {...register("serialNumber", {
                    required: true,
                  })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fireArmType">Type</Label>
                <Input
                  id="fireArmType"
                  placeholder="e.g., Glock 17"
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
            <Button
              type="submit"
              disabled={isSubmitting || (isEdit && !hasChanged)}
            >
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
