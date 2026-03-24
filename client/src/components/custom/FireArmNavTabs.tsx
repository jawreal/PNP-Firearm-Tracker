import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface IProps {
  recordType: "active" | "archive";
  onChangeRecordType: () => void;
}

const FireArmNavTabs = (props: IProps) => {
  const { recordType, onChangeRecordType } = props;
  return (
    <div className="flex gap-x-3">
      <Button
        variant="ghost"
        className={cn(
          "px-0 pb-6 mt-2 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
          recordType === "active" &&
            "text-indigo-600 dark:text-indigo-500 [&_div]:bg-indigo-500 [&_div]:block",
        )}
        onClick={onChangeRecordType}
      >
        Active list
        <div className="mt-1 h-[2.4px] w-full absolute bottom-0"></div>
      </Button>
      <Button
        variant="ghost"
        onClick={onChangeRecordType}
        className={cn(
          "px-0 pb-6 mt-2 active:bg-transparent hover:bg-transparent self-start flex flex-col items-start relative font-medium text-gray-500 dark:text-zinc-400 [&_div]:hidden",
          recordType === "archive" &&
            "text-indigo-600 dark:text-indigo-500 [&_div]:bg-indigo-500 [&_div]:block",
        )}
      >
        Archive
        <div className="mt-1 h-[2.4px] w-full absolute bottom-0"></div>
      </Button>
    </div>
  );
};

export default memo(FireArmNavTabs);
