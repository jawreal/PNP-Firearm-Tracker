import type { ReactNode } from "react";
import Image from "@/components/custom/Image";
import { Skeleton } from "../ui/skeleton";

export const TableSkeleton = () => {
  return (
    <div className="w-full h-[30rem] rounded-sm p-4">
      <div className="w-full h-full flex flex-col space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Skeleton className="h-12 rounded" />
          <Skeleton className="h-12 rounded" />
          <Skeleton className="h-12 rounded" />
        </div>
        <div className="flex-1 flex flex-col space-y-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-12 rounded" />
              <Skeleton className="h-12 rounded" />
              <Skeleton className="h-12 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ErrorFallback = ({
  description = "Error loading data. Please try again later.",
  children,
}: {
  description?: string;
  children?: ReactNode;
}) => {
  return (
    <div className="w-full flex flex-col justify-center items-center min-h-[30rem]">
      <div className="w-full h-80 flex flex-col pt-20 items-center md:h-[25rem]">
        <Image url="/no_record.svg" className="w-40 h-40" />
        <span className="text-sm mt-3 px-20 text-center text-gray-500 dark:text-gray-400">
          {children ? children : description}
        </span>
      </div>
    </div>
  );
};
