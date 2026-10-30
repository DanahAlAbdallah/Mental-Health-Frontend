import { Link } from "react-router-dom";
import { ArrowUp, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LOGO from "../assets/LOGO-TRNS.png";

// STYLE SHARED BY ALL THE FOOTER LINKS, SO WE WRITE IT ONLY ONCE
const linkClass =
  "inline-block text-sm text-muted transition-all duration-200 hover:translate-x-0.5 hover:text-primary";

// SMALL TITLE ABOVE EACH GROUP OF LINKS
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-heading">
      {children}
    </h3>
  );
}

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-surface">
      {/* THIN COLORED LINE FROM YOUR THEME */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="EUPHORIA home" className="inline-block">
              <div className="flex h-12 w-36 items-center overflow-hidden">
                <img
                  src={LOGO}
                  alt="EUPHORIA"
                  className="-ml-2 h-24 w-30 max-w-none object-contain"
                />
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
              Your mind matters. Find a therapist you trust, book a session, and
              learn with articles written by professionals.
            </p>
          </div>

          {/* EXPLORE */}
          <nav aria-label="Explore">
            <ColumnTitle>Explore</ColumnTitle>
            <ul className="space-y-3">
              <li>
                <Link to="/articles" className={linkClass}>
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/therapists" className={linkClass}>
                  Therapists
                </Link>
              </li>
            </ul>
          </nav>

          {/* ACCOUNT (CHANGES WITH THE LOGGED-IN USER) */}
          <nav aria-label="Account">
            <ColumnTitle>Account</ColumnTitle>
            <ul className="space-y-3">
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className={linkClass}>
                      My profile
                    </Link>
                  </li>
                  {user.role === "therapist" && (
                    <li>
                      <Link to="/dashboard" className={linkClass}>
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {user.role === "client" && (
                    <li>
                      <Link to="/my-sessions" className={linkClass}>
                        My sessions
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={linkClass}>
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className={linkClass}>
                      Create an account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* SUPPORT */}
          <div>
            <ColumnTitle>Support</ColumnTitle>
            <a
              href="mailto:hello@euphoria.com"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" />
              hello@euphoria.com
            </a>
            <p className="mt-4 rounded-xl bg-accent/30 px-4 py-3 text-xs leading-5 text-heading">
              If you are in immediate danger or thinking about harming
              yourself, contact your local emergency services right away.
            </p>
          </div>
        </div>

        {/* BOTTOM LINE */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} EUPHORIA. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-heading transition-colors hover:border-primary hover:text-primary"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;