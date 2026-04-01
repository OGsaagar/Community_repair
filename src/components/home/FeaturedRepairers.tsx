import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/shared/Avatar";
import { StarRating } from "@/components/shared/StarRating";
import Link from "next/link";

export async function FeaturedRepairers() {
  const supabase = await createClient();

  const { data: repairers } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, specialties, avg_rating, review_count, bio")
    .or("role.eq.repairer,role.eq.both")
    .gte("avg_rating", 4.5)
    .limit(6)
    .order("review_count", { ascending: false });

  if (!repairers || repairers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-display font-bold text-ink mb-4">
            Featured Specialists
          </h2>
          <p className="text-lg text-ink-60">
            Top-rated local repair experts in your area
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {repairers.map((repairer: any) => (
            <div
              key={repairer.id}
              className="bg-card border border-cream-3 rounded-lg p-6 hover:shadow-md transition"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <Avatar
                  name={repairer.full_name}
                  src={repairer.avatar_url}
                  size="lg"
                />
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold text-ink text-center mb-2">
                {repairer.full_name}
              </h3>

              {/* Rating */}
              <div className="flex items-center justify-center gap-1 mb-3">
                <StarRating
                  rating={repairer.avg_rating || 0}
                  interactive={false}
                />
                <span className="text-sm text-ink-60">
                  ({repairer.review_count || 0})
                </span>
              </div>

              {/* Bio */}
              {repairer.bio && (
                <p className="text-sm text-ink-60 text-center mb-4 line-clamp-2">
                  {repairer.bio}
                </p>
              )}

              {/* Specialties */}
              {repairer.specialties && repairer.specialties.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {repairer.specialties.slice(0, 2).map((specialty: string) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-green-light text-green text-xs font-semibold rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {repairer.specialties.length > 2 && (
                    <span className="text-xs text-ink-60">
                      +{repairer.specialties.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* View Profile Button */}
              <Link
                href={`/repairer/${repairer.id}`}
                className="block w-full px-4 py-2 bg-green text-white rounded-lg font-semibold text-center hover:bg-green-mid transition"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/search"
            className="inline-block px-8 py-3 border-2 border-green text-green rounded-lg font-semibold hover:bg-green-light transition"
          >
            Browse All Specialists
          </Link>
        </div>
      </div>
    </section>
  );
}
