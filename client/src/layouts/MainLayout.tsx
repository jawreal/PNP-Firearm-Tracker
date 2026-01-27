import Navbar from "@/layouts/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full flex flex-col gap-y-3">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
