import Navbar from "@/layouts/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="flex-1 flex justify-center py-5 px-4">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
