import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { PopoverClose } from "@radix-ui/react-popover";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import FormatDate from "@/lib/dateFormatter";
import { format } from "date-fns";

interface IProps {
  selectedRange: ISelectedRange;
  setSelectedRange: React.Dispatch<React.SetStateAction<ISelectedRange>>;
}

const NormallizeDate = (date: Date | undefined) => {
  const result = FormatDate(date?.toISOString());
  if (!result) {
    return "—";
  }
  return format(result, "MMM d, yyyy");
};

const DateFilter = (props: IProps) => {
  const { selectedRange, setSelectedRange } = props;
  const [activeField, setActiveField] = useState<IAtiveFields>("from");
  const isFrom = useMemo(() => activeField === "from", [activeField]);

  const onActivateField = useCallback((field: IAtiveFields) => {
    setActiveField(field);
  }, []);

  const onSelectedRange = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        return;
      }

      if (activeField === "from") {
        setSelectedRange((prev) => ({
          ...prev,
          from: date,
        }));
      }

      if (activeField === "to") {
        setSelectedRange((prev) => ({
          ...prev,
          to: date,
        }));
      }
    },
    [activeField],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="px-4">
          <CalendarDays className="text-gray-500 dark:text-gray-400" />
          Select Date
        </Button>
      </PopoverTrigger>
      <PopoverContent
        sideOffset={4}
        className="p-0 w-auto pt-2 transform translate-y-[10rem] ml-3 md:ml-0 md:-translate-x-[13rem]"
      >
        <span className="font-medium text-sm px-3 text-gray-500 dark:text-gray-400">
          Date Range
        </span>
        <div className="flex gap-x-2 px-3 mt-2">
          <Button
            variant="outline"
            onClick={() => onActivateField("from")}
            className={cn(
              "flex items-start flex-col h-auto gap-y-1 flex-1",
              isFrom &&
                " border-2 bg-indigo-200/30 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-900",
            )}
          >
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              FROM
            </span>
            <span className="font-medium text-sm">
              {NormallizeDate(selectedRange?.from)}
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onActivateField("to")}
            className={cn(
              "flex items-start flex-col h-auto gap-y-1 flex-1",
              !isFrom &&
                " border-2 bg-indigo-200/30 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-900",
            )}
          >
            <span className="text-xs font-medium capitalize text-gray-500 dark:text-gray-400">
              TO
            </span>
            <span className="font-medium text-sm">
              {NormallizeDate(selectedRange?.to)}
            </span>
          </Button>
        </div>

        <Calendar
          mode="single"
          selected={
            isFrom
              ? selectedRange?.from
              : !isFrom
                ? selectedRange?.to
                : undefined
          }
          onSelect={onSelectedRange}
          className="w-full"
        />
        <div className="flex gap-x-2 px-3 pb-3">
          <PopoverClose className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </PopoverClose>
          <Button
            className="flex-1"
            disabled={!selectedRange?.from || !selectedRange.to}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
