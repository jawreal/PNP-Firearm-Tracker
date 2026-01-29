import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, type FormEvent } from "react";
import { RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CustomToast } from "./CustomToast";
//import { useAuth } from "@/hooks/useAuthProvider";

const LogoutDialog = (props: IOpenChange) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  //const { setIsLoggedIn } = useAuth();
  const { open, onOpenChange } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      //setIsLoggedIn(false);
      navigate("/auth", {
        replace: true,
      });
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] px-4">
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
              <Button variant="outline" className="flex-1 border-gray-300">
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
