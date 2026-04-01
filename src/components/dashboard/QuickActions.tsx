import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      icon: "➕",
      label: "New Repair",
      href: "/request",
      color: "bg-green",
    },
    {
      icon: "🔄",
      label: "Re-repair",
      href: "#",
      color: "bg-amber",
    },
    {
      icon: "⚖️",
      label: "Dispute",
      href: "#",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="bg-card border border-cream-3 rounded-lg p-6">
      <h3 className="text-lg font-display font-bold text-ink mb-4">
        Quick Actions
      </h3>

      <div className="space-y-2">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-3 w-full px-4 py-3 ${action.color} text-white rounded-lg font-semibold hover:opacity-90 transition`}
          >
            <span className="text-lg">{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
