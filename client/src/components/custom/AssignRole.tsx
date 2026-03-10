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
import { Check, CircleAlert, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Fragment,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { CustomToast } from "./CustomToast";
import { useQueryClient } from "@tanstack/react-query";

interface IProps extends IOpenChange {
  data: IAdminUsers | null;
}

interface IPermissions {
  text: (() => ReactNode) | string;
  isChecked: boolean;
  isFunc?: boolean;
}

const ADMIN_PERMISSIONS: IPermissions[] = [
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

const HEAD_ADMIN_PERMISSIONS: IPermissions[] = [
  {
    text: () => (
      <span>
        Permanently <span className="font-bold">delete</span> firearm records
      </span>
    ),
    isChecked: true,
  },
  {
    text: () => (
      <span>
        <span className="font-bold">Deactivate</span> other admin accounts
      </span>
    ),
    isChecked: true,
  },
  {
    text: "Manage all system-level settings",
    isChecked: true,
  },
];

const AssignRole = (props: IProps) => {
  const { data, ...rest } = props;
  const queryClient = useQueryClient();
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fullName = useMemo(
    () => `${data?.firstName ?? "Uknown"} ${data?.lastName ?? ""}`,
    [data],
  );

  const permissions = useMemo(
    () => (enabled ? HEAD_ADMIN_PERMISSIONS : ADMIN_PERMISSIONS),
    [enabled],
  );

  const onSwitchChange = useCallback((checked: boolean) => {
    setEnabled(checked);
  }, []);

  const onSaveChanges = useCallback(async () => {
    try {
      if (!data || !data?._id || !enabled) {
        throw new Error();
      }
      setIsLoading(true);
      const response = await fetch("/api/admin/update/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: data?._id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process the role");
      }

      CustomToast({
        description: "Role has been updated successully",
        status: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-records"],
      });
      rest?.onOpenChange(false);
    } catch (error) {
      console.error(error);
      CustomToast({
        description: "Failed to update the role",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, enabled, rest, queryClient]);

  return (
    <Dialog {...rest}>
      <DialogContent className="sm:max-w-[425px] md:max-w-md md:rounded-lg px-0">
        <DialogHeader className="text-left px-6">
          <DialogTitle>Assign Role</DialogTitle>
          <DialogDescription>
            Configure access level to this user
          </DialogDescription>
        </DialogHeader>
        <div className="w-full text-sm flex px-6 py-3 border-y items-center gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${fullName}`}
            className="w-7 h-7 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-medium capitalize">{fullName}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
              {data?.emailAddress ?? "Email not found"}
            </span>
          </div>
          <div
            className={cn(
              "ml-auto flex gap-x-2 items-center text-emerald-600 dark:text-emerald-500 capitalize",
              enabled && "text-red-600 dark:text-red-500",
            )}
          >
            <span
              className={cn(
                "w-2 h-2 block rounded-full bg-emerald-500 dark:bg-emerald-600",
                enabled && "bg-red-500 dark:bg-red-600",
              )}
            ></span>
            {enabled ? "head admin" : "admin"}
          </div>
        </div>
        <div className="text-sm px-6 flex items-center">
          <div className="flex flex-col">
            <span className="font-medium">Promote to head admin</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs break-words pr-5">
              Grant elevated system privilleges
            </span>
          </div>
          <Switch
            className={cn(
              "ml-auto dark:data-[state=unchecked]:bg-gray-400/60",
              enabled && "data-[state=checked]:bg-red-500",
              "[&>span]:bg-white",
            )}
            checked={enabled}
            onCheckedChange={onSwitchChange}
          />
        </div>
        <div className="w-full flex px-6">
          <div
            className={cn(
              "w-full flex flex-col text-sm rounded-lg px-4 py-3 border gap-y-1 gap-x-2 bg-gray-100/50 dark:bg-gray-900/70",
              enabled &&
                "bg-red-100/50 dark:bg-red-950/70 border-red-300 dark:border-red-800",
            )}
          >
            <div className={cn("flex flex-col gap-y-1", enabled && "mb-1")}>
              <span
                className={cn(
                  "font-medium",
                  enabled && "text-red-600 dark:text-red-300",
                )}
              >
                {enabled ? "Head Admin Warning" : "Admin Permissions"}
              </span>
              {enabled && (
                <span className="text-red-500 dark:text-red-400">
                  Assigning Head Admin grants{" "}
                  <span className="font-bold">full system control</span>. This
                  user will be able to:
                </span>
              )}
            </div>
            {permissions.map((permission: IPermissions) => (
              <div className="flex items-center gap-x-2">
                {permission?.isChecked ? (
                  <Check
                    size={17}
                    className={cn("transform translate-y-[2px] text-emerald-500", enabled && "text-red-500 dark:text-red-400")} 
                  />
                ) : (
                  <X
                    size={17}
                    className="transform translate-y-[2px] text-red-600 dark:text-red-500"
                  />
                )}
                <span
                  className={cn(
                    "text-gray-500 dark:text-gray-400",
                    enabled && "text-red-500 dark:text-red-300",
                  )}
                >
                  {typeof permission?.text !== "string"
                    ? permission?.text()
                    : permission?.text}
                </span>
              </div>
            ))}
            {enabled && (
              <Fragment>
                <Separator className="my-2 bg-red-500 dark:bg-red-500" />
                <div className="flex gap-x-2 items-center text-red-500 dark:text-red-400">
                  <CircleAlert
                    size={20}
                    className="text-red-500 dark:text-red-400 flex-shrink-0"
                  />
                  <span className="font-medium">
                    This action cannot be undone without manual reassignment
                  </span>
                </div>
              </Fragment>
            )}
          </div>
        </div>
        <DialogFooter className="flex-row gap-x-3 px-6 md:gap-0 justify-end">
          <DialogClose asChild className="flex-1">
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            className={cn("flex-1", enabled && "bg-red-500 dark:bg-red-600")}
            disabled={!enabled || isLoading}
            onClick={onSaveChanges}
          >
            {isLoading && <RefreshCw className="animate-spin" />}
            {isLoading ? "Please wait..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignRole;
