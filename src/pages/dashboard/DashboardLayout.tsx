import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/articles", label: "My articles" },
  { to: "/dashboard/sessions", label: "My sessions" },
  { to: "/dashboard/availability", label: "My availability" },
];

function DashboardLayout() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row">
      {/* SIDEBAR */}
      <aside className="md:w-60 md:shrink-0">
        <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-button-text"
                    : "text-heading hover:bg-black/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* PAGE CONTENT */}
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
