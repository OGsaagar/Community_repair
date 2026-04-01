'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface OnboardingStatus {
  onboarded: boolean
  accountId?: string
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  loading: boolean
  error?: string
}

export function StripeConnectOnboarding() {
  const supabase = createClient()
  const [status, setStatus] = useState<OnboardingStatus>({
    onboarded: false,
    loading: true,
  })
  const [isGeneratingLink, setIsGeneratingLink] = useState(false)

  // Check current onboarding status
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['repairer-profile'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('profiles')
        .select(
          'id, stripe_account_id, stripe_onboarded, stripe_charges_enabled, stripe_payouts_enabled'
        )
        .eq('id', user.id)
        .single()

      if (error) throw error
      return data
    },
  })

  useEffect(() => {
    if (profile) {
      setStatus({
        onboarded: profile.stripe_onboarded || false,
        accountId: profile.stripe_account_id,
        chargesEnabled: profile.stripe_charges_enabled,
        payoutsEnabled: profile.stripe_payouts_enabled,
        loading: false,
      })
    } else if (!isLoadingProfile) {
      setStatus(prev => ({ ...prev, loading: false }))
    }
  }, [profile, isLoadingProfile])

  const handleStartOnboarding = async () => {
    setIsGeneratingLink(true)
    try {
      const response = await fetch('/api/stripe/create-account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate onboarding link')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
      setIsGeneratingLink(false)
    }
  }

  if (status.loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Stripe Connect Setup
      </h3>

      {status.onboarded ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-900">
                Stripe account connected
              </p>
              <p className="text-sm text-green-700">
                Your account is fully set up and ready to receive payments.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded bg-gray-50 p-3">
              <p className="text-gray-600">Account ID</p>
              <p className="font-mono text-xs text-gray-900">
                {status.accountId?.substring(0, 8)}...
              </p>
            </div>
            {status.chargesEnabled && (
              <div className="rounded bg-green-50 p-3">
                <p className="text-gray-600">Charges Enabled</p>
                <p className="text-green-700 font-medium">✓ Yes</p>
              </div>
            )}
            {status.payoutsEnabled && (
              <div className="rounded bg-green-50 p-3">
                <p className="text-gray-600">Payouts Enabled</p>
                <p className="text-green-700 font-medium">✓ Yes</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            Connect your Stripe account to start receiving payments from clients. 
            This is required before clients can pay for repair jobs you accept.
          </p>

          {status.error && (
            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700">{status.error}</p>
            </div>
          )}

          <button
            onClick={handleStartOnboarding}
            disabled={isGeneratingLink}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGeneratingLink ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              'Connect Stripe Account'
            )}
          </button>

          <p className="text-xs text-gray-500">
            You'll be redirected to Stripe to complete the setup process. 
            It typically takes a few minutes.
          </p>
        </div>
      )}
    </div>
  )
}
