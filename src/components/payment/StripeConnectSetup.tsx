"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StripeConnectSetup({ repairerId }: { repairerId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartOnboarding = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repairerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to start onboarding");
      }

      const { onboardingUrl } = await response.json();
      window.location.href = onboardingUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h3 className="font-semibold text-ink-900 mb-2">Set Up Payments</h3>
      <p className="text-sm text-gray-700 mb-4">
        Connect your Stripe account to receive payments for completed repairs.
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <button
        onClick={handleStartOnboarding}
        disabled={isLoading}
        className="rounded-lg bg-blue-600 px-6 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Setting up..." : "Connect Stripe Account"}
      </button>
    </div>
  );
}
