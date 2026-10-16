import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-border bg-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        {/* Brand */}
        <div className="text-center md:text-left">
          <Link
            to="/"
            className="text-xl tracking-wide text-heading"
          >
            EUPHORIA
          </Link>
          <p className="mt-1 text-sm text-muted">Your mind matters.</p>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-8 text-sm text-muted">
          <Link to="/articles" className="transition-colors hover:text-heading">
            Articles
          </Link>
          <Link
            to="/therapists"
            className="transition-colors hover:text-heading"
          >
            Therapists
          </Link>
          <a
            href="mailto:hello@euphoria.com"
            className="transition-colors hover:text-heading"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Bottom line */}
      <div className="mx-auto mt-8 max-w-6xl text-center text-xs text-muted/80 md:text-left">
        © {new Date().getFullYear()} EUPHORIA. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
