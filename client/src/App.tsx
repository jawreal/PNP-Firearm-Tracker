import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FireArmRecord from "@/pages/FireArmRecord";
import AuditLog from "@/pages/AuditLog";
import Admins from "@/pages/Admins";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import useDarkMode from "@/hooks/useDarkMode";
import LoginForm from "@/components/custom/LoginForm";
import ConfirmPassForm from "./components/custom/ConfirmPasswordForm";

const App = () => {
  useDarkMode();
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<MainLayout />}>
          <Route path="overview/dashboard" element={<Dashboard />} />
          <Route path="firearms/registry" element={<FireArmRecord />} />
          <Route path="audit/log" element={<AuditLog />} />
          <Route path="manage/admins" element={<Admins />} />
        </Route>
        <Route path="/auth" element={<LandingPage />}>
          <Route path="login" element={<LoginForm />} />
          <Route path="update/password" element={<ConfirmPassForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
