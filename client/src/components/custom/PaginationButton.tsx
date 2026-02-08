import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageButtons = Array(3).fill(0)

const PaginationButtons = () => {
  return (
    <div className="flex flex-row items-center justify-end mt-3 gap-x-2 text-sm">
      <Button variant="outline" size="icon">
        <ChevronLeft />
      </Button>
      {pageButtons.map((_, idx: number) =>
      <Button key={idx} variant="outline" size="icon">
        {idx + 1}
      </Button>)}
      <Button variant="outline" size="icon">
        <ChevronRight />
      </Button>
    </div>
  );
};
export default PaginationButtons;
