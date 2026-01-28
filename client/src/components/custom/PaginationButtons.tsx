import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationButtons = () => {
  return (
    <div className="flex flex-row items-center justify-end mt-3 gap-x-2 text-sm">
      <span className="text-gray-500 dark:text-gray-400 mr-2">Page 7 out of 10</span>
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
