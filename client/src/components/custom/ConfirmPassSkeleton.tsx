import { Skeleton } from "@/components/ui/skeleton";

const ConfirmPassSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-y-3">
      <Skeleton className="h-7 w-2/3 rounded-lg bg-zinc-100" />
      <Skeleton className="h-4 w-full rounded-lg bg-zinc-100" />
      <Skeleton className="h-4 w-4/5 rounded-lg bg-zinc-100 mb-2" />
      <Skeleton className="h-10 w-full rounded-lg bg-zinc-100" />
      <Skeleton className="h-10 w-full rounded-lg bg-zinc-100" />
      <div className="flex mt-1">
        <Skeleton className="h-10 w-full rounded-lg bg-indigo-100 dark:bg-indigo-900/80" />
      </div>
      <div className="flex justify-end mt-1">
        <Skeleton className="h-3.5 w-24 rounded-full bg-zinc-100" />
      </div>
    </div>
  );
};

export default ConfirmPassSkeleton;
