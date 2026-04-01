"use client";

import { Avatar } from "@/components/shared/Avatar";

interface GamificationCardProps {
  userName: string;
  repairPoints: number;
  badgeLevel: number;
  totalRepairs: number;
}

export function GamificationCard({
  userName,
  repairPoints,
  badgeLevel,
  totalRepairs,
}: GamificationCardProps) {
  const badges = [
    { level: 1, name: "Rookie", color: "bg-blue-light text-blue", emoji: "🌱" },
    { level: 2, name: "Pro", color: "bg-amber-light text-amber", emoji: "⭐" },
    { level: 3, name: "Master", color: "bg-green-light text-green", emoji: "👑" },
    {
      level: 4,
      name: "Legend",
      color: "bg-purple-light text-purple",
      emoji: "🏆",
    },
  ];

  const currentBadge = badges[Math.min(badgeLevel - 1, badges.length - 1)];
  const nextPointsNeeded = Math.max(0, badgeLevel * 100 - repairPoints);

  return (
    <div className="bg-card border border-cream-3 rounded-lg p-6">
      <h3 className="text-lg font-display font-bold text-ink mb-6">
        Your Journey
      </h3>

      {/* Badge */}
      <div className="text-center mb-6">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${currentBadge.color} text-3xl mb-3`}
        >
          {currentBadge.emoji}
        </div>
        <p className="font-semibold text-ink">{currentBadge.name}</p>
        <p className="text-xs text-ink-60">Level {badgeLevel}</p>
      </div>

      {/* Points Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-ink-60">Repair Points</span>
          <span className="text-sm font-bold text-green">{repairPoints}</span>
        </div>
        <div className="w-full bg-cream-2 rounded-full h-2">
          <div
            className="bg-green rounded-full h-2 transition-all"
            style={{
              width: `${Math.min((repairPoints / (badgeLevel * 100)) * 100, 100)}%`,
            }}
          />
        </div>
        {nextPointsNeeded > 0 && (
          <p className="text-xs text-ink-60 mt-2">
            {nextPointsNeeded} points until next level
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-cream-3">
        <div>
          <p className="text-2xl font-display font-bold text-green">
            {totalRepairs}
          </p>
          <p className="text-xs text-ink-60">Repairs Completed</p>
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-amber">
            {badgeLevel}
          </p>
          <p className="text-xs text-ink-60">Achievement Level</p>
        </div>
      </div>
    </div>
  );
}
