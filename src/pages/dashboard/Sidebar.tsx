import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  dashboardLinks,
  exploreLinks,
  generalLinks,
} from "../../hooks/dashboard/dashboardLinks";
import { LogOut } from "lucide-react";
import LOGO from "../../assets/LOGO-TRNS.png";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="md:sticky md:w-64 md:shrink-0">
      <div className="rounded-2xl md:border md:border-primary/15 md:p-4 md:shadow-sm">
        {/*WEBSITE LOGO */}
        <Link to="/dashboard" className="mb-6 flex items-center justify-center">
          <img
            src={LOGO}
            alt="EUPHORIA"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/*SIDEBAR LINKS */}
        <nav className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:gap-1 md:overflow-visible md:pb-0">
          {/* WORKSPACE = OVERVIEW + MY ARTICLES + MY SESSIONS + MY AVAILABILITY*/}
          <p className="px-4 pb-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Workspace
          </p>

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

          {/* EXPLORE = ARTICLES + THERAPISTS*/}
          <div className="my-3 border-t border-primary/15 pt-3">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Explore
            </p>

            {exploreLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
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
          </div>

          {/* GENERAL = PROFILE + LOGOUT */}
          <div className="my-3 border-t border-primary/15 pt-3">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              General
            </p>
            {generalLinks.map(({ to, label, icon: Icon }) => (
              // PROFILE
              <NavLink
                key={to}
                to={to}
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

            {/* LOGOUT */}
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <LogOut className="h-[18px] w-[18px]" />
              Logout
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
