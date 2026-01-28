import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaginationButtons = () => {
  return (
    <div className="flex w-full justify-end gap-x-2 mt-3 items-center">
      <span className="mr-3 text-sm text-gray-500 dark:text-gray-400">Page 1 out of 10</span>
      <Button variant="outline" size="icon">
        <ChevronLeft />
      </Button>
      <Button variant="outline" size="icon">
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PaginationButtons;
