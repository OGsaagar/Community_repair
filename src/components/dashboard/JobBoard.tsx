"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BidForm } from "@/components/dashboard/BidForm";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface PendingJob {
  id: string;
  device_type: string;
  issue_type: string;
  location_text: string;
  budget_min: number;
  budget_max: number;
  urgency: "asap" | "normal" | "flexible";
  created_at: string;
  bid_count: number;
}

export function JobBoard() {
  const [jobs, setJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await supabase
          .from("repairs")
          .select(
            `id, device_type, issue_type, location_text, budget_min, budget_max, 
             urgency, created_at, bids(count)`
          )
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(20);

        if (data) {
          setJobs(
            data.map((job: any) => ({
              ...job,
              bid_count: job.bids?.[0]?.count || 0,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-ink-60">Loading jobs...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-card border border-cream-3 rounded-lg">
        <p className="text-ink-60">No pending repair jobs at the moment.</p>
        <p className="text-sm text-ink-60 mt-2">Check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-display font-bold text-ink">Available Jobs</h3>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-card border border-cream-3 rounded-lg p-6 hover:shadow-md transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <hgroup className="mb-2">
                <h4 className="text-lg font-semibold text-ink">
                  {job.device_type} - {job.issue_type}
                </h4>
                <p className="text-sm text-ink-60">📍 {job.location_text}</p>
              </hgroup>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm font-semibold text-green">
                  ${(job.budget_min / 100).toFixed(2)} - ${(job.budget_max / 100).toFixed(2)}
                </span>
                {job.urgency === "asap" && (
                  <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded">
                    ASAP
                  </span>
                )}
                <span className="text-xs text-ink-60">
                  {job.bid_count} bid{job.bid_count !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                setSelectedJob(selectedJob === job.id ? null : job.id)
              }
              className="px-4 py-2 bg-green text-white rounded-lg font-semibold hover:bg-green-mid transition"
            >
              {selectedJob === job.id ? "✓" : "Bid"}
            </button>
          </div>

          {/* Bid Form */}
          {selectedJob === job.id && (
            <div className="mt-4 pt-4 border-t border-cream-3">
              <BidForm
                onSubmitBid={(data) => {
                  console.log("Bid submitted:", { repairId: job.id, ...data });
                  setSelectedJob(null);
                }}
                isSubmitting={false}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
