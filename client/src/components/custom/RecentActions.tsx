import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "@/components/custom/Image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import useFetchData from "@/hooks/useFetchData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";

export const RecentActionsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full"
    >
      <Card className="w-full md:h-full h-[25rem] gap-y-3 py-0 shadow-sm border-gray-200 dark:border-gray-800 rounded-lg dark:bg-gray-900/70 overflow-hidden">
        <CardHeader className="pb-0 border-b py-5">
          <CardTitle className="font-semibold">Recent Audit Action</CardTitle>
          <CardDescription className="text-sm">
            A list of recent action performed by admin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 flex-1 flex flex-col items-stretch">
          <div className="flex flex-col py-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="flex items-center gap-x-3 px-6 py-4 mt-4 border rounded-sm border-gray-200 dark:border-gray-800 first:mt-0"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse ring-2 ring-gray-100 dark:ring-gray-800" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 gap-2">
                  <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RecentActions = () => {
  const queryKey = useMemo(() => ["admin-recent-action"], []);
  const { data, isLoading } = useFetchData<
    RecordQuery<{
      description: string;
      createdAt: string;
    }>
  >(
    `/api/dashboard/retrieve/recent-action`,
    queryKey,
    true, // enable placeholder data to keep previous data while loading new data
  );

  if (isLoading) {
    return <RecentActionsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full h-full"
    >
      <Card className="w-full md:h-full h-[25rem] gap-y-3 py-0 shadow-sm border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <CardHeader className="pb-0 border-b py-5">
          <CardTitle className="font-semibold">Recent Audit Action</CardTitle>
          <CardDescription className="text-sm">
            A list of recent action performed by admin
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 flex-1 flex flex-col items-stretch">
          {data?.length !== 0 && !isLoading && (
            <div className="flex flex-col py-3">
              {data?.map((reg, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-x-3 px-6 py-4 mt-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group border rounded-sm border-gray-200 dark:border-gray-800 first:mt-0"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium dark:text-gray-100 text-sm truncate">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          strong: ({ ...props }) => (
                            <strong
                              {...props}
                              className="font-medium text-blue-700 dark:text-blue-600"
                            />
                          ),
                        }}
                      >
                        {reg.description ?? "Description not found"}
                      </ReactMarkdown>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-xs shrink-0">
                    <span className="font-medium">
                      {format(reg.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {data?.length === 0 && (
            <div className="flex-1 gap-y-2 flex-col flex items-center justify-center">
              <Image className="aspect-5/2" url="/empty.svg" />
              <span className="text-gray-500 text-sm dark:text-gray-400">
                No recent actions performed
              </span>
            </div>
          )}
        </CardContent>
        {data?.length !== 0 && (
          <CardFooter className="pt-0 py-5 px-6 border-t">
            <Link to="/admin/pending" className="flex gap-x-2 items-center">
              <span className="text-sm font-medium">View audit</span>
              <ArrowRight size={20} />
            </Link>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default RecentActions;
