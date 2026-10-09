import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent text-heading"
        : "text-heading hover:bg-background-soft"
    }`;

  return (
    <nav className="relative z-50 bg-background px-5 py-4 shadow-sm sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2"
        >
          {/* <span className="text-3xl">🌻</span> */}

          <div>
            <p className="text-lg font-semibold leading-tight text-heading">
              Athar-أثر
            </p>
            <p className="text-xs text-muted">Your mind matters</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <NavLink to="/articles" className={navLinkClass}>
            Articles
          </NavLink>
          <NavLink to="/therapists" className={navLinkClass}>
            Therapists
          </NavLink>

          {user ? (
            <>
              {user.role === "therapist" && (
                <NavLink to="/availability" className={navLinkClass}>
                  My Availability
                </NavLink>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSettingsOpen((open) => !open)}
                  aria-label="Open account settings"
                  aria-expanded={settingsOpen}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                    settingsOpen
                      ? "border-primary bg-background-soft"
                      : "border-border bg-background hover:bg-background-soft"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V2.9a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2 2.9Z" />
                  </svg>
                </button>

                {settingsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-border bg-surface p-2 shadow-lg">
                    <div className="border-b border-border px-3 py-3">
                      <p className="font-semibold text-heading">{user.name}</p>
                      <p className="mt-1 text-xs capitalize text-muted">
                        {user.role}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setSettingsOpen(false)}
                      className="mt-2 block rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-background-soft"
                    >
                      👤 My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setSettingsOpen(false);
                        handleLogout();
                      }}
                      className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-heading transition-colors hover:bg-accent/50"
                    >
                      ↪ Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-button-text transition-colors hover:bg-accent-hover"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-button-text transition-colors hover:bg-primary-hover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background-soft text-heading transition-colors hover:bg-primary/30 md:hidden"
        >
          {menuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-border bg-background px-5 py-5 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link
              to="/articles"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-background-soft"
            >
              Articles
            </Link>

            <Link
              to="/therapists"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-background-soft"
            >
              Therapists
            </Link>

            {user ? (
              <>
                {user.role === "therapist" && (
                  <Link
                    to="/availability"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-sm font-medium text-heading transition-colors hover:bg-background-soft"
                  >
                    My Availability
                  </Link>
                )}

                <div className="my-2 border-t border-border" />

                <p className="px-4 py-2 text-sm text-muted">
                  {user.name} · {user.role}
                </p>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-border bg-background-soft px-4 py-3 text-center text-sm font-semibold text-heading transition-colors hover:bg-primary/30"
                >
                  👤 My Profile
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-button-text transition-colors hover:bg-accent-hover"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-border" />

                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-button-text transition-colors hover:bg-accent-hover"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-button-text transition-colors hover:bg-primary-hover"
                >
                  Sign Up
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
