import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

export function Avatar({
  name,
  src,
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-green-light border-2 border-green-border",
        "flex items-center justify-center font-semibold text-green",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
