export function Footer() {
  return (
    <footer className="bg-ink text-white py-12 border-t border-cream-3">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-display text-lg mb-4">RepairHub</h3>
            <p className="text-ink-60 text-sm">
              Repair. Reuse. Reconnect.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li>
                <a href="#" className="hover:text-white transition">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Find Repairers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li>
                <a href="#" className="hover:text-white transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-ink-60">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-cream-3 pt-6 text-center text-sm text-ink-60">
          <p>&copy; 2024 RepairHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
