import useAuthStore from "@/hooks/useAuthStore";
import MainLayout from "@/layouts/MainLayout";
import Admins from "@/pages/Admins";
import AuditLog from "@/pages/AuditLog";
import Dashboard from "@/pages/Dashboard";
import FireArmRecord from "@/pages/FireArmRecord";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";

const PrivateRoutes = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isLoading } = useQuery({ queryKey: ["user-session"] }); // reads from cache, no new fetch

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="overview/dashboard" element={<Dashboard />} />
        <Route path="firearms/registry" element={<FireArmRecord />} />
        <Route path="audit/log" element={<AuditLog />} />
        <Route path="manage/admins" element={<Admins />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
