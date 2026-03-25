import useAuthStore from "@/hooks/useAuthStore";
import MainLayout from "@/layouts/MainLayout";
import Admins from "@/pages/Admins";
import AuditLog from "@/pages/AuditLog";
import Dashboard from "@/pages/Dashboard";
import FireArmRecord from "@/pages/FireArmRecord";
import NotFound from "@/pages/NotFound";
import { useQueryDummy } from "@/hooks/useQueryDummy";
import { Navigate, Route, Routes } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

const PrivateRoutes = () => {
  useDarkMode();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { isLoading } = useQueryDummy("user-session");
  // dummy query to get the isLoading from the global query

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="overview/dashboard" element={<Dashboard />} />
        <Route path="firearms/registry" element={<FireArmRecord />} />
        <Route path="audit/log" element={<AuditLog />} />
        <Route path="manage/admins" element={<Admins />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default PrivateRoutes;
