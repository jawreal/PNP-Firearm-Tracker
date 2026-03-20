import { Button } from "@/components/ui/button";
import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const atPrivateRoute = useMemo(
    () => location.pathname.includes("app"),
    [location],
  );

  const onGoBack = useCallback(() => {
    if (!atPrivateRoute) {
      return navigate("/auth/login", {
        replace: true,
      });
    }
    return navigate("/app/overview/dashboard", {
      replace: true,
    });
  }, [atPrivateRoute]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center dark:bg-zinc-950">
      <div className="flex flex-col items-center">
        <img
          src="/not_found.svg"
          alt="error chart"
          className="w-32 h-32 md:w-40 md:h-40 rounded-md"
        />
        <span className="text-xl md:text-3xl font-bold">Page not found</span>
        <span className="text-gray-500 dark:text-gray-400 text-center w-80 md:w-[24rem] mt-3">
          The page you're looking for can't be found. It may have been moved,
          deleted, or the URL might be incorrect.
        </span>
        <Button className="mt-4 w-40" onClick={onGoBack}>
          {atPrivateRoute ? "Go back" : "Go home"}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
