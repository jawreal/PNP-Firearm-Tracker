import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DialogClose } from "@radix-ui/react-dialog";
import { Check, X } from "lucide-react";
import { Button } from "../ui/button";
const ADMIN_PERMISSION = [
  {
    text: "Register new firearm records",
    isChecked: true,
  },
  {
    text: "Read & view all firearm records",
    isChecked: true,
  },
  {
    text: "Archive firearm records",
    isChecked: true,
  },
  {
    text: "Add other admin accounts",
    isChecked: true,
  },
  {
    text: "Cannot delete firearm records",
    isChecked: false,
  },
  {
    text: "Cannot deactivate admin accounts",
    isChecked: false,
  },
];

const AssignRole = (props: IOpenChange) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md md:rounded-lg px-0">
        <DialogHeader className="text-left px-6">
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Configure access level to this user
          </DialogDescription>
        </DialogHeader>
        <div className="w-full text-sm flex px-6 py-3 border items-center gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${"Jorell Relleve"}`}
            className="w-7 h-7 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium capitalize">Jorell Relleve</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
              jorellrelleve@gmail.com
            </span>
          </div>
          <div className="ml-auto flex gap-x-2 items-center text-emerald-600 dark:text-emerald-500 capitalize">
            <span className="w-2 h-2 block rounded-full bg-emerald-500 dark:bg-emerald-600"></span>
            admin
          </div>
        </div>
        <div className="text-sm px-6 flex items-center">
          <div className="flex flex-col">
            <span className="font-medium">Promote to head admin</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
              Grant elevated system privilleges
            </span>
          </div>
          <Switch className="ml-auto dark:data-[state=unchecked]:bg-gray-400/60" />
        </div>
        <div className="w-full flex px-6">
          <div className="w-full flex flex-col text-sm rounded-lg px-4 py-3 border gap-y-1 gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
            <span className="font-medium">Admin Permissions</span>
            {ADMIN_PERMISSION.map((permission) => (
              <div className="flex items-center gap-x-2">
                {permission?.isChecked ? (
                  <Check
                    size={17}
                    className="transform translate-y-[2px] text-emerald-600 dark:text-emerald-500"
                  />
                ) : (
                  <X
                    size={17}
                    className="transform translate-y-[2px] text-red-600 dark:text-red-500"
                  />
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {permission?.text}
                </span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="flex-row gap-x-3 px-6 md:gap-0 justify-end">
          <DialogClose asChild className="flex-1">
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" className="flex-1">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRole;
