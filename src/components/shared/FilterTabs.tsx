"use client";

import { cn } from "@/lib/utils";

interface FilterTabsProps {
  tabs: Array<{ label: string; value: string }>;
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabs({
  tabs,
  active,
  onChange,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "flex gap-1.5 bg-cream-2 rounded-full p-1 w-fit flex-wrap",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-semibold transition-all",
            active === tab.value
              ? "bg-card text-ink shadow-sm"
              : "bg-transparent text-ink-60 hover:text-ink"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
