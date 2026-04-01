import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface SubmitPaymentParams {
  repairId: string
  amount: number
  repairerStripeId: string
}

export interface PaymentResponse {
  client_secret: string
  payment_intent_id: string
}

export function useSubmitPayment() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: SubmitPaymentParams) => {
      // Create payment intent via Stripe API
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: params.amount,
          repairerStripeId: params.repairerStripeId,
          repairId: params.repairId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment intent')
      }

      const data = (await response.json()) as PaymentResponse
      return data
    },
    onSuccess: () => {
      // Invalidate repairs query to refresh data
      queryClient.invalidateQueries({ queryKey: ['repairs'] })
    },
  })
}

export function useAcceptBid() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { bidId: string; repairId: string }) => {
      // Get bid details
      const { data: bid, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('id', params.bidId)
        .single()

      if (bidError || !bid) throw new Error('Bid not found')

      // Get repair details
      const { data: repair, error: repairError } = await supabase
        .from('repairs')
        .select('*')
        .eq('id', params.repairId)
        .single()

      if (repairError || !repair) throw new Error('Repair not found')

      // Get repairer to get Stripe ID
      const { data: repairer, error: repairerError } = await supabase
        .from('profiles')
        .select('stripe_account_id, email, full_name')
        .eq('id', bid.repairer_id)
        .single()

      if (repairerError || !repairer?.stripe_account_id) {
        throw new Error('Repairer has not completed Stripe onboarding')
      }

      // Update bid status to accepted
      const { error: updateError } = await supabase
        .from('bids')
        .update({ status: 'accepted' })
        .eq('id', params.bidId)

      if (updateError) throw updateError

      // Send email notification to repairer
      try {
        await fetch('/api/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: repairer.email || 'repairer@example.com',
            type: 'bid_accepted',
            data: {
              repairerName: repairer.full_name,
              clientName: repair.client_name,
              amount: bid.amount,
              device: repair.device_type,
              repairId: params.repairId,
            },
          }),
        });
      } catch (error) {
        console.error('Failed to send bid acceptance email:', error);
      }

      return { bidId: params.bidId, repairId: params.repairId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
      queryClient.invalidateQueries({ queryKey: ['repairs'] })
    },
  })
}

export function useRejectBid() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (bidId: string) => {
      const { error } = await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('id', bidId)

      if (error) throw error
      return { bidId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bids'] })
    },
  })
}
