import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FireArmRecord from "@/pages/FireArmRecord";
import AuditLog from "./pages/AuditLog";
import Admins from "./pages/Admins";

/*const firearmRecord: IFireArm = {
  firstName: "John",
  lastName: "Doe",
  serialNumber: "BR-99021-X",
  fireArmType: "Glock 17",
  station: "North District",
  department: "Patrol",
  status: "active",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};*/

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>,
          <Route
            path="/overview/dashboard"
            element={<div>Dashboard Page</div>}
          />
          <Route path="/firearms/registry" element={<FireArmRecord />} />
          <Route path="/audit/log" element={<AuditLog />} />
          <Route path="/manage/admins" element={<Admins />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
