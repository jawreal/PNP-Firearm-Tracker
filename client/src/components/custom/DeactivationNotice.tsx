import FormFooter from "@/components/custom/FormFooter";
import { useCallback, useState } from "react";
import ResetPassword from "./ResetPassword";
import PageLogo from "./PageLogo";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeactivationNotice = () => {
  const navigate = useNavigate();
  const [openForgotPass, setOpenForgotPass] = useState<boolean>(false);

  const onGobackToLogin = useCallback(
    () =>
      navigate("/auth/login", {
        replace: true,
      }),
    [navigate],
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start gap-2">
        <PageLogo />
        <div>
          <h1 className="text-2xl font-bold mt-5">Account deactivated</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Deactivation notice by system administrator
          </p>
        </div>
      </div>
      <ResetPassword
        open={openForgotPass}
        onOpenChange={setOpenForgotPass}
        invalidLink={true}
      />
      <div className="w-full mt-4 mb-3 flex flex-col text-sm rounded-lg px-5 py-4 border border-amber-400 dark:border-amber-800 gap-y-1 gap-x-2 bg-amber-100/50 dark:bg-amber-900/70">
        <span className="text-amber-700 dark:text-gray-400">
          Your account has been suspended due to multiple failed login attempts
          and a suspected unauthorized access to restricted logistics records.
          Please contact your supervisor for further instructions.
        </span>
      </div>
      <Separator className="bg-gray-200/60 dark:bg-gray-700/70 mt-1 mb-3" />
      <div className="flex">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            DEACTIVATED BY
          </span>
          <span className="text-sm">Jorell Relleve</span>
        </div>
        <div className="flex flex-col ml-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400">DATE</span>
          <span className="text-sm">March 13, 2026</span>
        </div>
      </div>
      <Button className="mt-5" onClick={onGobackToLogin}>
        Back to login
      </Button>
      <div className="flex flex-col gap-y-4 mt-4">
        <FormFooter showSeparator={false} />
      </div>
    </div>
  );
};

export default DeactivationNotice;
