import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { SidebarProfile } from "./SidebarProfile";
import { dashboardLinks } from "../../hooks/dashboard/dashboardLinks";

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start">
      {/* SIDEBAR */}
      <aside className="md:sticky md:top-24 md:w-64 md:shrink-0">
        <div className="rounded-2xl md:border md:border-primary/15 md:p-4 md:shadow-sm">
          {/* PROFILE HEADER (DESKTOP ONLY) */}
          <SidebarProfile user={user} />

          {/* LINKS */}
          <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {dashboardLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-button-text shadow-sm"
                      : "text-heading/70 hover:bg-primary/10 hover:text-primary"
                  }`
                }
              >
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
