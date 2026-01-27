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
          <Route index element={<FireArmTable />} />
          <Route path="/firearms" element={<div>Firearms Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
