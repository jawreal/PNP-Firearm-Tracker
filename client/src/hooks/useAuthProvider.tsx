import { useQuery } from "@tanstack/react-query";
import { motion, type Transition } from "framer-motion";
import * as React from "react";
import useAuthStore from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/button";

interface IUser {
  user?: Partial<IAdminUsers>;
}

const bounceTransition: Transition = {
  duration: 0.6,
  repeat: Infinity,
  ease: "easeInOut",
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const { isLoading, error } = useQuery<IUser>({
    queryKey: ["user-session"],
    queryFn: async () => {
      const response = await fetch("/api/auth/check/session");
      if (!response.ok) {
        throw new Error("Failed to check session");
      }
      const result = await response.json();
      console.log("Result: ", result);
      return result;
    }, // to follow later
    staleTime: 1000 * 60 * 5, // 5 minute
    select: (data) => {
      // set the data directly if the query was successful. this avoids using useEffect and addtional boilerplate
      setUser(data?.user ?? null);
      return data;
    },
  });

  const onRefresh = React.useCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading) {
    /* Show 3 dots loading that bounces */
    return (
      <div className="w-full min-h-screen flex items-center justify-center dark:bg-zinc-950">
        <div className="flex gap-x-3">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ ...bounceTransition, delay: 0 }}
            className="bg-indigo-500 dark:bg-indigo-400 h-3 w-3 rounded-full"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ ...bounceTransition, delay: 0.15 }}
            className="bg-indigo-500 dark:bg-indigo-400 h-3 w-3 rounded-full"
          />

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ ...bounceTransition, delay: 0.3 }}
            className="bg-indigo-500 dark:bg-indigo-400 h-3 w-3 rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    /* Show error display */
    return (
      <div className="w-full min-h-screen flex items-center justify-center dark:bg-zinc-950">
        <div className="flex flex-col items-center text-center">
          <img
            src="/connection_lost.svg"
            alt="Connection lost"
            className="w-52 h-52"
          />

          <span className="text-3xl font-bold">Connection Lost</span>

          <span className="text-gray-500 dark:text-gray-400 w-[24rem] mt-3">
            It looks like your connection was interrupted. We couldn’t load the
            page you requested. Please check your internet connection and try
            again.
          </span>

          <Button className="mt-5 w-44" onClick={onRefresh}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export { AuthProvider };
