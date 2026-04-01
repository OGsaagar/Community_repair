import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Star, MapPin, Clock, Award } from 'lucide-react'

interface RepairerProfilePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: RepairerProfilePageProps) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('id', params.id)
    .single()

  if (!profile) {
    return { title: 'Repairer Not Found' }
  }

  return {
    title: `${profile.full_name} - RepairHub`,
    description: profile.bio || 'View this repairer profile',
  }
}

export default async function RepairerProfilePage({ params }: RepairerProfilePageProps) {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      repairs:repairs!repairer_id(count),
      reviews:reviews!repairer_id(count)
    `
    )
    .eq('id', params.id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Sample data for reviews and repairs since we don't have full schema yet
  const reviews = [
    { id: 1, rating: 5, comment: 'Great work! Very professional.', author: 'John D.', date: '2024-03-15' },
    {
      id: 2,
      rating: 5,
      comment: 'Fixed my laptop quickly and affordably.',
      author: 'Sarah M.',
      date: '2024-03-10',
    },
    {
      id: 3,
      rating: 4,
      comment: 'Good service, would use again.',
      author: 'Mike R.',
      date: '2024-03-05',
    },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Profile Card */}
        <div className="bg-white rounded-lg border border-cream-3 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="size-24 rounded-full bg-gradient-to-br from-green to-green-700 text-white flex items-center justify-center text-4xl font-bold flex-shrink-0">
              {profile.full_name?.[0]?.toUpperCase() || '?'}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-ink mb-2">{profile.full_name}</h1>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="size-5 text-amber fill-amber" />
                  <span className="font-semibold text-ink">{profile.avg_rating?.toFixed(1) || '5.0'}</span>
                  <span className="text-ink-60 text-sm">({profile.reviews?.[0]?.count || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-ink-60">
                  <Clock className="size-4" />
                  <span className="text-sm">{profile.repairs?.[0]?.count || 0} repairs completed</span>
                </div>
                {profile.is_verified && (
                  <div className="flex items-center gap-1 text-green font-medium">
                    <Award className="size-4" />
                    <span className="text-sm">Verified Expert</span>
                  </div>
                )}
              </div>

              {/* Bio */}
              {profile.bio && <p className="text-ink-60 mb-4 max-w-2xl">{profile.bio}</p>}

              {/* ServiceArea */}
              {profile.service_area && (
                <div className="flex items-center gap-2 text-ink-60">
                  <MapPin className="size-4" />
                  <span className="text-sm">Service area: {profile.service_area}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
              Request Quote
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h2 className="text-xl font-semibold text-ink mb-4">About</h2>
              <div className="space-y-4 text-ink-60">
                <div>
                  <p className="font-medium text-ink mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.specialties &&
                      profile.specialties.map((specialty: string) => (
                        <span key={specialty} className="px-3 py-1 bg-green-50 text-green rounded-full text-sm">
                          {specialty}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">Response Time</p>
                  <p>Usually responds within 2 hours</p>
                </div>

                <div>
                  <p className="font-medium text-ink mb-1">Member Since</p>
                  <p>{new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h2 className="text-xl font-semibold text-ink mb-4">Reviews ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="pb-4 border-b border-cream-2 last:border-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-ink">{review.author}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${i < review.rating ? 'text-amber fill-amber' : 'text-cream-3'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-ink-60">{review.date}</p>
                    </div>
                    <p className="text-ink-60 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-6">
              <h3 className="font-semibold text-ink mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors font-medium">
                  Message
                </button>
                <button className="w-full px-4 py-2 border border-green text-green rounded-lg hover:bg-green-50 transition-colors font-medium">
                  View Availability
                </button>
              </div>
            </div>

            {/* Response Stats */}
            <div className="bg-white rounded-lg border border-cream-3 p-6 space-y-3">
              <h3 className="font-semibold text-ink mb-4">Response Stats</h3>
              <div>
                <p className="text-sm text-ink-60 mb-1">Response Rate</p>
                <p className="text-2xl font-bold text-green">98%</p>
              </div>
              <div>
                <p className="text-sm text-ink-60 mb-1">Response Time</p>
                <p className="font-medium text-ink">~2 hours</p>
              </div>
              <div>
                <p className="text-sm text-ink-60 mb-1">Completion Rate</p>
                <p className="text-2xl font-bold text-green">100%</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h3 className="font-semibold text-ink mb-4">Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '⭐', label: 'Top Rated', desc: '+4.8★' },
                  { emoji: '✓', label: 'Verified', desc: 'ID checked' },
                  { emoji: '🎯', label: 'Professional', desc: '100 repairs' },
                  { emoji: '⚡', label: 'Quick', desc: '<2h response' },
                ].map((badge) => (
                  <div key={badge.label} className="text-center p-3 bg-cream-50 rounded-lg">
                    <p className="text-2xl mb-1">{badge.emoji}</p>
                    <p className="text-xs font-medium text-ink">{badge.label}</p>
                    <p className="text-xs text-ink-60">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
