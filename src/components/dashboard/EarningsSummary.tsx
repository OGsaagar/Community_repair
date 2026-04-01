"use client";

export function EarningsSummary({
  totalEarnings,
  pendingPayouts,
  completedRepairs,
}: {
  totalEarnings: number;
  pendingPayouts: number;
  completedRepairs: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
        <p className="text-2xl font-bold text-green-600 mt-2">${totalEarnings.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-lg">
        <p className="text-sm font-medium text-gray-600">Pending Payout</p>
        <p className="text-2xl font-bold text-amber-600 mt-2">${pendingPayouts.toFixed(2)}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
        <p className="text-sm font-medium text-gray-600">Repairs Completed</p>
        <p className="text-2xl font-bold text-blue-600 mt-2">{completedRepairs}</p>
      </div>
    </div>
  );
}
