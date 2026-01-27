import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import FireArmTable from "./components/custom/FireArmTable";

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
        <Route path="/" element={<MainLayout />}>
          <Route
            path="/overview/dashboard"
            element={<div>Dashboard Page</div>}
          />
          <Route path="/firearms/registry" element={<FireArmTable />} />
          <Route path="/audit/log" element={<div>Audit log Page</div>} />
          <Route path="/manage/admins" element={<div>Admins Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
