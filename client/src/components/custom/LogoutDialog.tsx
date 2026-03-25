import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useCallback, useState, type FormEvent } from "react";
import { RefreshCw } from "lucide-react";
import { CustomToast } from "./CustomToast";
import useAuthStore from "@/hooks/useAuthStore";

const LogoutDialog = (props: IOpenChange) => {
  const clearSession = useAuthStore((s) => s.clear);
  const { open, onOpenChange } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/session/logout", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to logout");
        }
      
        clearSession();
        console.log("logout success");
      } catch (error) {
        console.log("Error in logging out");
        CustomToast({
          description: "Error in logging out. Please try again.",
          status: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [clearSession],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] px-4">
        {/* header, title, and description are required but not needed here. that's why it's hidden here */}
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <form onSubmit={handleLogout} className="space-y-4">
          <div className="flex flex-col w-full text-center">
            <span className="font-medium">
              Are you sure you want to logout?{" "}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              this will make your unsaved work gone
            </span>
          </div>
          <DialogFooter className="flex-row gap-x-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              type="submit"
              className="flex-1 transition-all active:scale-95"
            >
              {isLoading && <RefreshCw className="animate-spin" />}
              {isLoading ? "Please wait..." : "Logout"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogoutDialog;
