import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  count,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={i}
              onClick={() => interactive && onRate?.(starValue)}
              disabled={!interactive}
              className={cn(
                "text-lg transition-colors",
                isFilled ? "text-amber" : "text-cream-3",
                interactive && "cursor-pointer hover:text-amber"
              )}
            >
              ★
            </button>
          );
        })}
      </div>
      {count && (
        <span className="text-sm text-ink-60">
          {rating.toFixed(1)} ({count})
        </span>
      )}
      {!count && (
        <span className="text-sm text-ink-60">
          {rating.toFixed(1)}/5
        </span>
      )}
    </div>
  );
}
