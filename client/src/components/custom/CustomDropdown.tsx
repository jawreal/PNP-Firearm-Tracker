import { Button } from "@/components/ui/button";
import { Check, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, memo, type JSX } from "react";
import { cn } from "@/lib/utils";

interface ICustomDropdown<T> {
  state: T;
  setState?: Dispatch<SetStateAction<T>>;
  onSelect?: (e?: Event) => void;
  options: T[];
  btnClassName?: string;
  dropdownWidth?: string;
  icon: LucideIcon;
  leftIcon?: boolean;
}

export default memo(CustomDropdown) as <T>(
  props: ICustomDropdown<T>,
) => JSX.Element;

function CustomDropdown<T>(props: ICustomDropdown<T>) {
  const {
    state,
    setState,
    options,
    btnClassName,
    dropdownWidth,
    icon: Icon,
    leftIcon = false,
    onSelect, // for custom onSelect
  } = props;

  const selectOption = useCallback(
    (e: Event) => {
      e.preventDefault();
      {
        /* Set the state based on selected option */
      }
      const id = (e.currentTarget as HTMLElement).id;
      setState?.(id as T);
    },
    [setState],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn("font-inter capitalize justify-between px-3", btnClassName)}
          id={state as string}
        >
          <span className={cn(leftIcon && "order-1")}>{state as string}</span>
          <Icon className="text-gray-500 dark:text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("font-inter", dropdownWidth)}
        align="start"
      >
        <DropdownMenuGroup>
          {options?.map((option: T) => (
            <DropdownMenuItem
              onSelect={setState ? selectOption : onSelect}
              id={option as string}
              key={option as string}
              className="capitalize"
            >
              {option as string}
              {state === option && <Check className="ml-auto" />}{" "}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
