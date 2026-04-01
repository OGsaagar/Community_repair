"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { SearchFilters } from "@/components/search/SearchFilters";
import { Avatar } from "@/components/shared/Avatar";
import { StarRating } from "@/components/shared/StarRating";

interface Repairer {
  id: string;
  full_name: string;
  avatar_url: string | null;
  specialties: string[];
  avg_rating: number;
  review_count: number;
  bio: string;
}

export default function SearchPage() {
  const [repairers, setRepairers] = useState<Repairer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "price" | "newest">("rating");
  const [minRating, setMinRating] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchRepairers = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("profiles")
          .select("id, full_name, avatar_url, specialties, avg_rating, review_count, bio")
          .or("role.eq.repairer,role.eq.both");

        // Filter by specialty
        if (selectedSpecialty) {
          query = query.contains("specialties", [selectedSpecialty]);
        }

        // Filter by minimum rating
        if (minRating > 0) {
          query = query.gte("avg_rating", minRating);
        }

        const { data, error } = await query;

        if (error) throw error;

        let filtered = (data || []) as Repairer[];

        // Filter by search term
        if (searchTerm) {
          filtered = filtered.filter((r) =>
            r.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.bio?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Sort
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "rating":
              return (b.avg_rating || 0) - (a.avg_rating || 0);
            case "distance":
              return 0; // Would need geolocation context
            case "price":
              return 0; // Would need pricing data
            case "newest":
              return 0; // Would need created_at dates
            default:
              return 0;
          }
        });

        setRepairers(filtered);
      } catch (error) {
        console.error("Failed to fetch repairers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairers();
  }, [selectedSpecialty, minRating, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ink mb-2">
            Find a Repairer
          </h1>
          <p className="text-ink-60">Browse and connect with skilled repair specialists</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSpecualty={selectedSpecialty}
              onSpecialtyChange={setSelectedSpecialty}
              sortBy={sortBy}
              onSortChange={setSortBy}
              minRating={minRating}
              onMinRatingChange={setMinRating}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-ink-60">Loading repairers...</p>
              </div>
            ) : repairers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-ink-60">No repairers found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {repairers.map((repairer) => (
                  <div
                    key={repairer.id}
                    className="bg-card border border-cream-3 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex gap-4">
                      <Avatar
                        name={repairer.full_name}
                        src={repairer.avatar_url}
                        size="lg"
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-ink">{repairer.full_name}</h3>

                        {repairer.specialties && repairer.specialties.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {repairer.specialties.slice(0, 3).map((specialty) => (
                              <span
                                key={specialty}
                                className="px-2 py-1 bg-green-light text-green text-xs font-semibold rounded"
                              >
                                {specialty}
                              </span>
                            ))}
                            {repairer.specialties.length > 3 && (
                              <span className="text-xs text-ink-60">
                                +{repairer.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {repairer.bio && (
                          <p className="text-sm text-ink-60 mt-2">{repairer.bio}</p>
                        )}

                        <div className="flex items-center gap-4 mt-4">
                          <div className="flex items-center gap-1">
                            <StarRating
                              rating={repairer.avg_rating || 0}
                              interactive={false}
                            />
                            <span className="text-sm text-ink-60">
                              {repairer.avg_rating || "N/A"} ({repairer.review_count || 0} reviews)
                            </span>
                          </div>

                          <button className="ml-auto px-4 py-2 bg-green text-white rounded-lg hover:bg-green-mid transition font-semibold">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
