"use client";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { StarRating } from "@/components/shared/StarRating";

interface RepairCardProps {
  id: string;
  device_type: string;
  brand: string;
  model: string;
  status: string;
  repairer?: {
    full_name: string;
    avg_rating: number;
  };
  createdAt: string;
  onClick: () => void;
}

export function RepairJourneyCard({ repair, onClick }: { repair: RepairCardProps; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-left block w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-ink-900">
            {repair.brand} {repair.model}
          </h3>
          <p className="text-sm text-gray-600">{repair.device_type}</p>
        </div>
        <StatusBadge status={repair.status as any} />
      </div>

      {repair.repairer && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm font-medium text-ink-900">{repair.repairer.full_name}</p>
          <div className="flex items-center gap-2">
            <StarRating rating={repair.repairer.avg_rating} interactive={false} />
            <span className="text-xs text-gray-600">{repair.repairer.avg_rating.toFixed(1)}</span>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">{new Date(repair.createdAt).toLocaleDateString()}</p>
    </button>
  );
}
