import { NavLink, Outlet } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { type LucideIcon, LayoutDashboard, FileText, CalendarDays, CalendarClock } from "lucide-react";

type DashboardLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
};

const links: DashboardLink[] = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/articles", label: "My articles", icon: FileText },
  { to: "/dashboard/sessions", label: "My sessions", icon: CalendarDays },
  {
    to: "/dashboard/availability",
    label: "My availability",
    icon: CalendarClock,
  },
  // later: clients, notes
];

function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-start">
      {/* SIDEBAR */}
      <aside className="md:sticky md:top-24 md:w-64 md:shrink-0">
        <div className="rounded-2xl md:border md:border-primary/15 md:p-4 md:shadow-sm">
          {/* PROFILE HEADER (DESKTOP ONLY) */}
          <div className="mb-4 hidden items-center gap-3 border-b border-primary/15 pb-4 md:flex">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-semibold text-button-text">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-heading">
                {user?.name}
              </p>
              <p className="text-xs text-muted">Therapist dashboard</p>
            </div>
          </div>

          {/* LINKS */}
          <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
            {links.map(({ to, label, icon: Icon, end }) => (
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
