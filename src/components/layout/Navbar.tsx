import Link from "next/link";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <nav className="bg-card border-b border-cream-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green font-display">
          RepairHub
        </Link>

        <div className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-sm text-ink-60 hover:text-ink transition"
          >
            Home
          </Link>
          <Link
            href="/request"
            className="text-sm text-ink-60 hover:text-ink transition"
          >
            Request Repair
          </Link>
          <Link
            href="/dashboard/client"
            className="px-4 py-2 bg-green text-white rounded-md text-sm font-semibold hover:bg-green-mid transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
