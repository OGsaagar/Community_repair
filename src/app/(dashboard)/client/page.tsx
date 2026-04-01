"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GamificationCard } from "@/components/dashboard/GamificationCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAuth } from "@/hooks/useAuth";

export default function ClientDashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold text-ink mb-8">
            My Repairs
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-card border border-cream-3 rounded-lg p-6">
                  <p className="text-ink-60 text-sm mb-2">Active Repairs</p>
                  <p className="text-4xl font-display font-bold text-green">
                    2
                  </p>
                </div>
                <div className="bg-card border border-cream-3 rounded-lg p-6">
                  <p className="text-ink-60 text-sm mb-2">Total Spent</p>
                  <p className="text-4xl font-display font-bold text-ink">
                    $487
                  </p>
                </div>
                <div className="bg-card border border-cream-3 rounded-lg p-6">
                  <p className="text-ink-60 text-sm mb-2">Money Saved</p>
                  <p className="text-4xl font-display font-bold text-amber">
                    $1,200+
                  </p>
                </div>
              </div>

              {/* Active Repairs */}
              <div className="bg-card border border-cream-3 rounded-lg p-8">
                <h2 className="text-2xl font-display font-bold text-ink mb-6">
                  Your Active Repairs
                </h2>
                <p className="text-ink-60">
                  No active repairs yet.{" "}
                  <a
                    href="/request"
                    className="text-green font-semibold hover:text-green-mid"
                  >
                    Post your first repair request
                  </a>
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Gamification */}
              <GamificationCard
                userName={user?.user_metadata?.full_name || "You"}
                repairPoints={1250}
                badgeLevel={2}
                totalRepairs={5}
              />

              {/* Quick Actions */}
              <QuickActions />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
