import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FireArmRecord from "@/pages/FireArmRecord";
import AuditLog from "@/pages/AuditLog";
import Admins from "@/pages/Admins";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "./pages/LandingPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/app" element={<MainLayout />}>
          <Route path="overview/dashboard" element={<Dashboard />} />
          <Route path="firearms/registry" element={<FireArmRecord />} />
          <Route path="audit/log" element={<AuditLog />} />
          <Route path="manage/admins" element={<Admins />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
