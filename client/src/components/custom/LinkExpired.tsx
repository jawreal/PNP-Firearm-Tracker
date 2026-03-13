import { ArrowLeft, CircleAlert } from "lucide-react";
import FormFooter from "./FormFooter";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";
import ResetPassword from "./ResetPassword";

const REASONS: string[] = [
  "The link has already been used to reset a password",
  "The 5-minute expiry window has passed",
  "The link was copied or opened incorrectly",
];

const LinkExpired = () => {
  const [openForgotPass, setOpenForgotPass] = useState<boolean>(false);

  const onOpenForgotPass = useCallback(() => setOpenForgotPass(true), []);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="p-3 dark:border rounded-full dark:border-red-800 bg-red-200/50 dark:bg-red-950/80">
          <CircleAlert size={20} className="text-red-500 dark:text-red-300" />
        </div>
        <h1 className="text-2xl font-bold mt-5">Link invalid or expired</h1>
        <p className="text-balance text-sm text-muted-foreground">
          This password reset link is no longer valid. It may have already been
          used, expired after 5 minutes, or the URL may be incomplete.
        </p>
      </div>
      <ResetPassword
        open={openForgotPass}
        onOpenChange={setOpenForgotPass}
        invalidLink={true}
      />
      <div className="w-full mt-4 mb-3 flex flex-col text-sm rounded-lg px-5 py-4 border gap-y-1 gap-x-2 bg-gray-100/50 dark:bg-gray-900/70">
        <span className="mb-2">This usually happens when:</span>
        {REASONS.map((reason: string, index: number) => (
          <div key={index} className="flex gap-x-2 relative">
            <span className="transform translate-y-1 block h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-400 flex-shrink-0" />
            <span className="text-gray-500 dark:text-gray-400">{reason}</span>
          </div>
        ))}
      </div>
      <Button
        type="button"
        className="w-full h-11 rounded-lg disabled:cursor-not-allowed my-3"
        onClick={onOpenForgotPass}
      >
        Request a new reset link
      </Button>
      <Link
        to="/auth/login"
        replace={true}
        className="text-gray-400 text-xs ml-auto mb-4 mt-2 items-center flex gap-x-2"
      >
        <ArrowLeft size={18} /> Back to login
      </Link>
      <div className="flex flex-col gap-y-4">
        <FormFooter />
      </div>
    </div>
  );
};

export default LinkExpired;
