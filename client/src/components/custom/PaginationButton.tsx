import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "@/lib/getPaginationRange";
import { useMemo } from "react"

const PaginationButtons = () => {
  const pageButtons = useMemo(() => getPaginationRange(1, 10, 3), [])
  return (
    <div className="flex flex-row items-center justify-end mt-3 gap-x-2 text-sm">
      <Button variant="outline" size="icon">
        <ChevronLeft />
      </Button>
      {pageButtons.map((page: number, idx: number) =>
      <Button key={idx} variant="outline" size="icon">
        {page}
      </Button>)}
      <Button variant="outline" size="icon">
        <ChevronRight />
      </Button>
    </div>
  );
};
export default PaginationButtons;
