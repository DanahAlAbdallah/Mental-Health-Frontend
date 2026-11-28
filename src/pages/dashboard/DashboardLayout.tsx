import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start">
      {/* SIDEBAR */}
      <Sidebar />

      {/* PAGE CONTENT */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
