import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPaginationRange } from "@/lib/getPaginationRange";
import {
  useMemo,
  memo,
  type SetStateAction,
  type Dispatch,
  useCallback,
} from "react";

interface IProps {
  setPage: Dispatch<SetStateAction<number>>;
  dataLength: number;
  hasNextPage?: boolean;
  totalPages: number;
  currentPage: number;
}

const PaginationButtons = ({
  setPage,
  dataLength,
  hasNextPage,
  totalPages,
  currentPage,
}: IProps) => {
  const pageButtons = useMemo(
    () =>
      getPaginationRange(
        currentPage,
        dataLength,
        totalPages > 3 ? 3 : totalPages, // total pages must not exceed 3 to avoid showing more than 3 page buttons as per design.
      ),
    [currentPage, dataLength, totalPages],
  );
  const prevPage = useCallback(() => {
    setPage((prev) => prev - 1); // navigate to previous page
  }, [setPage]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1); // navigate to next page
  }, [setPage]);

  const navigateToPage = useCallback(
    (page: number) => {
      // navigate to specific page when page button is clicked
      setPage(page);
    },
    [setPage],
  );

  return (
    <div className="flex flex-row items-center justify-end mt-3 gap-x-2 text-sm">
      <Button variant="outline" size="icon" onClick={prevPage}>
        <ChevronLeft />
      </Button>
      {pageButtons.map((page: number, idx: number) => (
        <Button
          key={idx}
          variant={page === currentPage ? "default" : "outline"} // set an active button style for the current page
          size="icon"
          disabled={page > currentPage && !hasNextPage}
          onClick={() => navigateToPage(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        onClick={nextPage}
        disabled={!hasNextPage}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
export default memo(PaginationButtons);
