import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import * as React from "react";
import useAuthStore from "@/hooks/useAuthStore";

interface IUser {
  user?: Partial<IAdminUsers>;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setUser = useAuthStore((s) => s.setUser);
  const { isLoading } = useQuery<IUser>({
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

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center dark:bg-zinc-950">
        <Loader size={50} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export { AuthProvider };
