import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAccountLink, createStripeAccount } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_account_id, full_name, email')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    let stripeAccountId = profile.stripe_account_id

    // Create Stripe account if not exists
    if (!stripeAccountId) {
      try {
        const account = await createStripeAccount(profile.email, profile.full_name)
        stripeAccountId = account.id

        // Update profile with Stripe account ID
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ stripe_account_id: stripeAccountId })
          .eq('id', user.id)

        if (updateError) {
          console.error('Error updating profile with Stripe ID:', updateError)
        }
      } catch (error) {
        console.error('Error creating Stripe account:', error)
        throw new Error('Failed to create Stripe account')
      }
    }

    // Generate account link
    try {
      const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/repairer/onboarding`
      const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/repairer/profile`
      const accountLink = await createAccountLink(stripeAccountId, refreshUrl, returnUrl)
      return NextResponse.json({ url: accountLink.url })
    } catch (error) {
      console.error('Error creating account link:', error)
      throw new Error('Failed to generate onboarding link')
    }
  } catch (error) {
    console.error('Account link creation error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create account link',
      },
      { status: 500 }
    )
  }
}
