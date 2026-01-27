import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, memo } from "react";

interface ICustomDropdown {
  status: FireArmStatus;
  setStatus: Dispatch<SetStateAction<FireArmStatus>>;
}
const options: FireArmStatus[] = ["active", "inactive"];
const CustomDropdown = (props: ICustomDropdown) => {
  const { status, setStatus } = props;
  const selectOption = useCallback(
    (e: Event) => {
      e.preventDefault();
      setStatus((prev: FireArmStatus) =>
        prev === "active" ? "inactive" : "active",
      );
    },
    [setStatus],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="font-inter capitalize w-40 justify-between px-3"
          id="status"
        >
          {status}
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 font-inter" align="start">
        <DropdownMenuGroup>
          {options?.map((option: string) => (
            <DropdownMenuItem
              onSelect={selectOption}
              id={option}
              key={option}
              className="capitalize"
            >
              {option}
              {status === option && <Check className="ml-auto" />}{" "}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default memo(CustomDropdown);
