import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LockIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Label } from "@/components/ui/label";
import CustomInput from "./CustomInput";
import { DialogClose } from "@radix-ui/react-dialog";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { useCallback, useMemo, useState } from "react";
import { CustomToast } from "./CustomToast";
import { useQueryClient } from "@tanstack/react-query";

interface IDeleteFirearm extends IOpenChange {
  record_id: string | undefined;
  serialNumber: string | undefined;
  firearmOwner: string | undefined;
  firearmType: string | undefined;
}

interface ISubmitPassword {
  password: string;
}

const DeleteFirearm = (props: IDeleteFirearm) => {
  const queryClient = useQueryClient();
  const [errorPassword, setErrorPassword] = useState<boolean>(false);
  const { record_id, serialNumber, firearmOwner, firearmType, ...rest } = props;
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
    control,
  } = useForm<ISubmitPassword>({
    mode: "onChange",
  });

  const allFields = useWatch<ISubmitPassword>({
    control,
  });

  const isInvalid = useMemo(() => {
    if (!allFields?.password?.length) {
      return false;
    }
    return allFields?.password?.length > 0;
  }, [allFields]);

  const onDeleteRecord: SubmitHandler<ISubmitPassword> = useCallback(
    async (data) => {
      try {
        console.log("ID: ", record_id);
        console.log("Data: ", data);
        if (!isInvalid || !record_id) {
          throw new Error();
        }

        const response = await fetch("/api/firearm/delete/record", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            record_id,
            ...data,
          }),
        });

        if (!response.ok) {
          throw new Error("Error deleting the firearm record");
        }

        const result = await response.json();
        if (result?.incorrectPass) {
          setErrorPassword(true);
          return CustomToast({
            description: "Incorrect password",
            status: "error",
          });
        }

        queryClient.invalidateQueries({
          queryKey: ["firearm-records"],
        });

        CustomToast({
          description: "Firearm record has been deleted succesfully",
          status: "success",
        });
        rest.onOpenChange(false);
      } catch (error) {
        CustomToast({
          description: "Failed to delete the record",
          status: "error",
        });
      }
    },
    [isInvalid, record_id, rest],
  );

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] gap-y-0 md:max-w-[28rem] font-inter flex flex-col">
        <form onSubmit={handleSubmit(onDeleteRecord)}>
          <DialogHeader className="text-left space-y-0">
            <DialogTitle className="font-inter text-1xl pr-7 capitalize">
              delete record
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full mt-4 mb-2 flex flex-col text-sm rounded-lg px-4 py-3 border gap-y-1 gap-x-2 bg-red-100/50 dark:bg-red-950/70 border-red-300 dark:border-red-800">
            <span className="text-red-500 dark:text-red-400 [&_span]:text-red-600 [&_span]:font-bold dark:[&_span]:text-red-300">
              You are about to permanently delete the{" "}
              <span>{firearmType ?? "Type not found"}</span> firearm record with
              serial number <span>{serialNumber ?? "Serial not found"}</span>{" "}
              registered under{" "}
              <span className="font-medium">
                {firearmOwner ?? "Owner not found"}
              </span>
              . This action is irreversible — all associated data will be
              permanently erased from the system. If you might need this record
              later, consider archiving it instead.
            </span>
          </div>
          <Separator className="mb-2 mt-4 bg-gray-300 dark:bg-gray-700/70" />
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm">
              Confirm your password to proceed
            </Label>
            <CustomInput
              icon={LockIcon}
              id="password"
              isPassword={true}
              isError={errorPassword}
              placeholder="Enter your password"
              {...register("password")}
            />
            <span className="text-xs text-gray-500">
              Your password is required to authorize this deletion.
            </span>
          </div>
          <DialogFooter className="mt-4 flex-row gap-x-2">
            <DialogClose asChild className="flex-1">
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer flex-1 bg-red-500 dark:bg-red-600"
              disabled={!isInvalid}
            >
              {isSubmitting && <RefreshCw className="animate-spin" />}
              {isSubmitting ? "Deleting..." : "Delete Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFirearm;
