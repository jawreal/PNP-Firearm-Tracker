import ConfirmPassForm from "@/components/custom/ConfirmPasswordForm";
import DeactivationNotice from "@/components/custom/DeactivationNotice";
import LoginForm from "@/components/custom/LoginForm";
import useAuthStore from "@/hooks/useAuthStore";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/pages/NotFound";
import { useQueryClient } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";

const AuthRoutes = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
    const state = queryClient.getQueryState(["user-session"]);
    const isLoading = state?.fetchStatus === "fetching"; // get the state from the user-session

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/app/overview/dashboard" replace={true} />;
  }

  return (
    <Routes>
      <Route element={<LandingPage />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="update/password/:code?" element={<ConfirmPassForm />} />
        <Route path="account/deactivated" element={<DeactivationNotice />} />
         <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
