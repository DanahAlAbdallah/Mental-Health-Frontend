function Footer() {
  return (
    <footer className="bg-heading text-white px-10 py-12">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌻</span>
            <span className="font-semibold">Bloom Again</span>
          </div>
          <p className="text-sm text-white/70">
            Your mind matters, every step of the way.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Explore</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href="#" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Resources
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <a href="#" className="hover:text-white">
                Get Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <p className="text-sm text-white/70">hello@bloomagain.com</p>
          <p className="text-sm text-white/70 mt-1">Beirut, Lebanon</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/20 mt-8 pt-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Bloom Again. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
