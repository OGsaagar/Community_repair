"use client";

import { ProgressBar } from "@/components/shared/ProgressBar";

interface JourneyStep {
  name: string;
  status: "completed" | "current" | "pending";
}

const REPAIR_STEPS: JourneyStep[] = [
  { name: "Quoted", status: "completed" },
  { name: "Accepted", status: "completed" },
  { name: "In Progress", status: "current" },
  { name: "Completed", status: "pending" },
  { name: "Delivered", status: "pending" },
];

export function JourneyTracker() {
  return (
    <div className="space-y-4">
      {REPAIR_STEPS.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
              step.status === "completed"
                ? "bg-green-500 text-white"
                : step.status === "current"
                ? "bg-amber-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.status === "completed" ? "✓" : index + 1}
          </div>
          <div className="flex-1">
            <p
              className={`font-medium ${
                step.status === "pending" ? "text-gray-500" : "text-ink-900"
              }`}
            >
              {step.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
