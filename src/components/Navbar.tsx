import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LOGO from "../assets/LOGO-TRNS.png";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  function handleLogout() {
    logout();
    navigate("/");
  }

  // CLOSE THE ACCOUNT DROPDOWN WHEN CLICKING OUTSIDE OR PRESSING ESCAPE
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!accountRef.current?.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSettingsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // DESKTOP LINK WITH AN ANIMATED LINE UNDER THE ACTIVE PAGE
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200
     after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left
     after:rounded-full after:bg-primary after:transition-transform after:duration-300 ${
       isActive
         ? "text-primary after:scale-x-100"
         : "text-heading/70 hover:text-heading after:scale-x-0 hover:after:scale-x-50"
     }`;

  // MOBILE LINK WITH A BAR ON THE LEFT FOR THE ACTIVE PAGE
  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl border-l-4 px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "border-primary bg-primary/10 text-primary"
        : "border-transparent text-heading hover:bg-background-soft"
    }`;

  // SIGN UP BUTTON: SOFT GRADIENT PILL WITH AN ARROW THAT SLIDES ON HOVER
  // SIGN UP BUTTON: YELLOW PILL WITH AN ARROW THAT SLIDES ON HOVER
  const signupButtonClass =
    "group inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-heading shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2";
  const avatar = user?.avatarUrl ? (
    <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
  ) : (
    <span className="text-white text-sm font-semibold text-button-text">
      {user?.name?.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 px-5 py-3 backdrop-blur-md sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center"
        >
          <div className="flex h-12 w-36 items-center overflow-hidden">
            <img
              src={LOGO}
              alt="EUPHORIA Logo"
              className="-ml-2 h-24 w-30 max-w-none object-contain"
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/articles" className={navLinkClass}>
            Articles
          </NavLink>
          <NavLink to="/therapists" className={navLinkClass}>
            Therapists
          </NavLink>

          {user ? (
            <>
              {user.role === "client" && (
                <NavLink to="/my-sessions" className={navLinkClass}>
                  My sessions
                </NavLink>
              )}
              {user.role === "therapist" && (
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
              )}

              {/* ACCOUNT MENU */}
              <div ref={accountRef} className="relative ml-3">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((open) => !open)}
                  aria-label="Open account menu"
                  aria-expanded={settingsOpen}
                  className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-2.5 transition-colors ${
                    settingsOpen
                      ? "border-primary bg-background-soft"
                      : "border-border hover:bg-background-soft"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary">
                    {avatar}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-muted transition-transform duration-200 ${
                      settingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {settingsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-60 rounded-2xl border border-border bg-surface p-2 shadow-lg">
                    <div className="border-b border-border px-3 py-3">
                      <p className="truncate font-semibold text-heading">
                        {user.name}
                      </p>
                      <p className="mt-0.5 text-xs capitalize text-muted">
                        {user.role}
                      </p>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setSettingsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-background-soft"
                      >
                        <User className="h-4 w-4 text-muted" />
                        My profile
                      </Link>

                      {user.role === "therapist" && (
                        <Link
                          to="/dashboard"
                          onClick={() => setSettingsOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-background-soft"
                        >
                          <LayoutDashboard className="h-4 w-4 text-muted" />
                          Dashboard
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSettingsOpen(false);
                          handleLogout();
                        }}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-heading transition-colors hover:bg-accent/50"
                      >
                        <LogOut className="h-4 w-4 text-muted" />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* SMALL DIVIDER BETWEEN THE PAGES AND THE ACCOUNT ACTIONS */}
              <span aria-hidden="true" className="mx-2 h-5 w-px bg-border" />

              {/* LOGIN: SAME ANIMATED LINE AS THE OTHER LINKS */}
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>

              {/* SIGN UP: GRADIENT PILL */}
              <Link to="/signup" className={`ml-1 ${signupButtonClass}`}>
                Sign up
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden"
        >
          <span className="relative block h-4 w-5 ">
            {/* TOP LINE */}
            <span
              className={`bg-primary absolute left-0 h-0.5 w-5 rounded-full  transition-all duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            {/* MIDDLE LINE (SHORTER, GROWS ON HOVER) */}
            <span
              className={`bg-accent absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full  transition-all duration-300 ${
                menuOpen ? "w-0 opacity-0" : "w-3.5 opacity-100 group-hover:w-5"
              }`}
            />
            {/* BOTTOM LINE */}
            <span
              className={`bg-primary absolute left-0 h-0.5 w-5 rounded-full  transition-all duration-300 ${
                menuOpen
                  ? "top-1/2 -translate-y-1/2 -rotate-45"
                  : "top-full -translate-y-full"
              }`}
            />
          </span>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-b border-border bg-background px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <NavLink
              to="/articles"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              Articles
            </NavLink>
            <NavLink
              to="/therapists"
              onClick={() => setMenuOpen(false)}
              className={mobileLinkClass}
            >
              Therapists
            </NavLink>

            {user ? (
              <>
                {user.role === "client" && (
                  <NavLink
                    to="/my-sessions"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    My sessions
                  </NavLink>
                )}
                {user.role === "therapist" && (
                  <NavLink
                    to="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className={mobileLinkClass}
                  >
                    Dashboard
                  </NavLink>
                )}

                <div className="my-3 border-t border-border" />

                <div className="flex items-center gap-3 px-4 pb-2">
                  <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary">
                    {avatar}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-heading">
                      {user.name}
                    </p>
                    <p className="text-xs capitalize text-muted">{user.role}</p>
                  </div>
                </div>

                <NavLink
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  My profile
                </NavLink>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 cursor-pointer rounded-full bg-accent px-4 py-3 text-sm font-semibold text-button-text transition-colors hover:bg-accent-hover"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <div className="my-3 border-t border-border" />

                {/* LOGIN: SAME LEFT BAR STYLE AS THE OTHER MOBILE LINKS */}
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLinkClass}
                >
                  Login
                </NavLink>

                {/* SIGN UP: FULL WIDTH GRADIENT PILL */}
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className={`mt-2 py-3 ${signupButtonClass}`}
                >
                  Sign up
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
