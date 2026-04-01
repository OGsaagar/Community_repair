import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, repairerStripeId, repairId } = body

    // Validate inputs
    if (!amount || !repairerStripeId || !repairId) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, repairerStripeId, repairId' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Verify repairer has Stripe account
    try {
      await stripe.accounts.retrieve(repairerStripeId)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid repairer Stripe account' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify repair exists and belongs to user
    const { data: repair, error: repairError } = await supabase
      .from('repairs')
      .select('id, client_id, amount, status')
      .eq('id', repairId)
      .eq('client_id', user.id)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Repair not found or unauthorized' },
        { status: 404 }
      )
    }

    // Verify amount matches repair amount
    if (parseFloat(amount) !== parseFloat(repair.amount)) {
      return NextResponse.json(
        { error: 'Payment amount does not match repair cost' },
        { status: 400 }
      )
    }

    // Calculate platform fee (10%)
    const amountCents = Math.round(parseFloat(amount) * 100)
    const applicationFeeCents = Math.round(amountCents * 0.1)

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: applicationFeeCents,
        metadata: {
          repairId,
          clientId: user.id,
          repairerStripeId,
        },
      },
      {
        stripeAccount: repairerStripeId,
      }
    )

    // Store payment record in database
    const { error: paymentError } = await supabase
      .from('payments')
      .upsert(
        {
          repair_id: repairId,
          stripe_payment_id: paymentIntent.id,
          amount: parseFloat(amount),
          status: 'pending',
          stripe_account_id: repairerStripeId,
        },
        { onConflict: 'stripe_payment_id' }
      )

    if (paymentError) {
      console.error('Error storing payment:', paymentError)
      // Still return payment intent even if storage fails
    }

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create payment intent',
      },
      { status: 500 }
    )
  }
}
