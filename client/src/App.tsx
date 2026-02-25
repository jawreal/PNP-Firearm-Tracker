import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FireArmRecord from "@/pages/FireArmRecord";
import AuditLog from "@/pages/AuditLog";
import Admins from "@/pages/Admins";
import Dashboard from "@/pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="/overview/dashboard" element={<Dashboard />} />
          <Route path="/firearms/registry" element={<FireArmRecord />} />
          <Route path="/audit/log" element={<AuditLog />} />
          <Route path="/manage/admins" element={<Admins />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
