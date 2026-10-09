
function Footer() {
  return (
    <footer className="bg-background-soft px-10 py-12 text-text">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="text-2xl">🌻</span>
            <span className="font-semibold text-heading">
              Bloom Again
            </span>
          </div>

          <p className="text-sm text-muted">
            Your mind matters, every step of the way.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-heading">
            Explore
          </h4>

          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                About
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                Resources
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-heading">
            Support
          </h4>

          <ul className="space-y-2 text-sm text-muted">
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                Get Support
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="transition-colors hover:text-heading">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-heading">
            Contact
          </h4>

          <p className="text-sm text-muted">
            hello@bloomagain.com
          </p>
          <p className="mt-1 text-sm text-muted">
            Beirut, Lebanon
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-border pt-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Bloom Again. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
