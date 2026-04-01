"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EarningsSummary } from "@/components/dashboard/EarningsSummary";
import { JobBoard } from "@/components/dashboard/JobBoard";

export default function RepairerDashboard() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-ink mb-8">
            Repair Dashboard
          </h1>

          {/* Earnings Summary */}
          <div className="mb-8">
            <EarningsSummary
              totalEarnings={12850}
              pendingPayouts={450}
              completedRepairs={42}
            />
          </div>

          {/* Job Board */}
          <div className="bg-card border border-cream-3 rounded-lg p-8">
            <JobBoard />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
