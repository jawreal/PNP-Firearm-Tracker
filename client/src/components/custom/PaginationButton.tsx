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
    () => getPaginationRange(currentPage, dataLength, totalPages > 3 ? 3 : totalPages),
    [currentPage, dataLength, totalPages],
  ); // total pages must not exceed 3 to avoid showing more than 3 page buttons as per design.

  const prevPage = useCallback(() => {
    setPage((prev) => prev - 1);
  }, [setPage]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, [setPage]);

  const navigateToPage = useCallback(
    (page: number) => {
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
          variant="outline"
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
