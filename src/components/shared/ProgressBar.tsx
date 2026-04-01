import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "green" | "amber";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "green",
  className,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  const colorClass =
    color === "green" ? "bg-green" : "bg-amber-mid";

  return (
    <div
      className={cn(
        "h-1.5 bg-cream-3 rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
