import { cn } from "@/lib/utils";

type RepairStatus =
  | "pending"
  | "quoted"
  | "accepted"
  | "in_progress"
  | "completed"
  | "reviewed"
  | "disputed"
  | "cancelled";

const STATUS_CONFIG: Record<
  RepairStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className:
      "bg-cream-2 text-ink-60 border-cream-3",
  },
  quoted: {
    label: "Quoted",
    className: "bg-blue-light text-blue border-blue-border",
  },
  accepted: {
    label: "Accepted",
    className: "bg-amber-light text-amber border-amber-border",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-light text-amber border-amber-border",
  },
  completed: {
    label: "Completed",
    className: "bg-green-light text-green border-green-border",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-green-light text-green border-green-border",
  },
  disputed: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 border-red-300",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-700 border-gray-300",
  },
};

export function StatusBadge({ status }: { status: RepairStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
        config.className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {config.label}
    </span>
  );
}
