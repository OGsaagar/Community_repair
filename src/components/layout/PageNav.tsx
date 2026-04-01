"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PageNavTab {
  name: string;
  href: string;
  icon?: string;
}

interface PageNavProps {
  tabs: PageNavTab[];
}

export function PageNav({ tabs }: PageNavProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 bg-cream border-b border-cream-3">
      <div className="max-w-6xl mx-auto px-6 flex gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-4 py-3 text-sm font-semibold transition-colors flex items-center gap-2",
                "border-b-2 border-transparent hover:text-ink",
                isActive
                  ? "text-green border-b-2 border-green"
                  : "text-ink-60"
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
