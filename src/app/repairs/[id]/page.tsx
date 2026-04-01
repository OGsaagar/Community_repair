import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { Clock, MapPin, DollarSign, Zap, MessageCircle } from 'lucide-react'

interface RepairPageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: RepairPageProps) {
  const supabase = await createClient()
  const { data: repair } = await supabase
    .from('repairs')
    .select(
      `
      *,
      client:profiles!client_id(full_name),
      repairer:profiles!repairer_id(full_name)
    `
    )
    .eq('id', params.id)
    .single()

  if (!repair) {
    return { title: 'Repair Not Found' }
  }

  return {
    title: `${repair.device_type} Repair - RepairHub`,
    description: `${repair.issue_description.substring(0, 100)}...`,
  }
}

export default async function RepairPage({ params }: RepairPageProps) {
  const supabase = await createClient()

  const { data: repair, error } = await supabase
    .from('repairs')
    .select(
      `
      *,
      client:profiles!client_id(full_name, avatar_url),
      repairer:profiles!repairer_id(full_name, avatar_url),
      bids(id, amount, created_at),
      repair_photos(storage_path, is_before),
      messages(count)
    `
    )
    .eq('id', params.id)
    .single()

  if (error || !repair) {
    notFound()
  }

  // Format status for display
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-blue-50 text-blue-700 border-blue-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  const statusLabel: Record<string, string> = {
    pending: 'Awaiting Bids',
    accepted: 'In Progress',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-2">
                {repair.device_type} Repair
              </h1>
              <p className="text-ink-60 mb-4">{repair.issue_description}</p>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full border text-sm font-medium ${statusColors[repair.status]}`}>
                  {statusLabel[repair.status]}
                </span>
                <span className="px-3 py-1 rounded-full bg-ink-5 text-ink-70 text-sm font-medium">
                  Urgency: {repair.urgency}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-green mb-2">${repair.budget}</p>
              <p className="text-ink-60 text-sm">Budget</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details Card */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h2 className="text-xl font-semibold text-ink mb-4">Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="size-5 text-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-60">Device Type</p>
                    <p className="font-medium text-ink">{repair.device_type}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-60">Location</p>
                    <p className="font-medium text-ink">{repair.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-60">Posted</p>
                    <p className="font-medium text-ink">
                      {new Date(repair.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="size-5 text-green mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-ink-60">Budget</p>
                    <p className="font-medium text-ink">${repair.budget}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Photos */}
            {repair.repair_photos && repair.repair_photos.length > 0 && (
              <div className="bg-white rounded-lg border border-cream-3 p-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {repair.repair_photos.map((photo: any, idx: number) => (
                    <div key={idx} className="aspect-square bg-cream-2 rounded-lg overflow-hidden border border-cream-3">
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-xs text-ink-60">
                            {photo.is_before ? 'Before' : 'After'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bids */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h2 className="text-xl font-semibold text-ink mb-4">
                Bids ({repair.bids?.length || 0})
              </h2>
              {repair.bids && repair.bids.length > 0 ? (
                <div className="space-y-3">
                  {repair.bids.map((bid: any) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between p-3 bg-cream-50 rounded-lg border border-cream-2"
                    >
                      <div>
                        <p className="font-medium text-ink">${bid.amount}</p>
                        <p className="text-xs text-ink-60">
                          {new Date(bid.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {repair.status === 'pending' && (
                        <button className="px-3 py-1 bg-green text-white text-sm rounded hover:bg-green-600 transition-colors">
                          Accept
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ink-60 text-sm">No bids yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white rounded-lg border border-cream-3 p-6">
              <h3 className="font-semibold text-ink mb-4">Client</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="size-12 rounded-full bg-green text-white flex items-center justify-center font-semibold">
                  {repair.client?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-ink">{repair.client?.full_name}</p>
                  <p className="text-xs text-ink-60">Member since 2023</p>
                </div>
              </div>
            </div>

            {/* Repairer Info */}
            {repair.repairer && (
              <div className="bg-white rounded-lg border border-cream-3 p-6">
                <h3 className="font-semibold text-ink mb-4">Repairer</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-12 rounded-full bg-amber text-white flex items-center justify-center font-semibold">
                    {repair.repairer?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{repair.repairer?.full_name}</p>
                    <p className="text-xs text-ink-60">⭐ 4.8 (120 reviews)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Messages Count */}
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 flex items-center gap-3">
              <MessageCircle className="size-5 text-green" />
              <div>
                <p className="text-sm font-medium text-ink">
                  {repair.messages?.[0]?.count || 0} messages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        <div className="mt-8 bg-white rounded-lg border border-cream-3 p-6">
          <h2 className="text-xl font-semibold text-ink mb-4">Communication</h2>
          <ChatPanel repairId={params.id} />
        </div>
      </div>
    </div>
  )
}
