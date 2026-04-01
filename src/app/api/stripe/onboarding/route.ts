import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStripeAccount, createAccountLink } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { repairerId } = await request.json();
    const supabase = await createClient();

    // Get repairer profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", repairerId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Repairer not found" }, { status: 404 });
    }

    // Check if already has Stripe account
    if (profile.stripe_account_id) {
      const link = await createAccountLink(
        profile.stripe_account_id,
        `${process.env.NEXT_PUBLIC_APP_URL}/repairer/payments`,
        `${process.env.NEXT_PUBLIC_APP_URL}/repairer/payments?success=true`
      );

      return NextResponse.json({ onboardingUrl: link.url });
    }

    // Create new Stripe account
    const stripeAccount = await createStripeAccount(
      profile.email,
      profile.full_name || "Repairer"
    );

    // Save Stripe account ID
    await supabase
      .from("profiles")
      .update({ stripe_account_id: stripeAccount.id })
      .eq("id", repairerId);

    // Create onboarding link
    const link = await createAccountLink(
      stripeAccount.id,
      `${process.env.NEXT_PUBLIC_APP_URL}/repairer/payments`,
      `${process.env.NEXT_PUBLIC_APP_URL}/repairer/payments?success=true`
    );

    return NextResponse.json({ onboardingUrl: link.url });
  } catch (error) {
    console.error("Stripe onboarding error:", error);
    return NextResponse.json(
      { error: "Failed to start onboarding" },
      { status: 500 }
    );
  }
}
