import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature);
    const supabase = await createClient();

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        const repairId = paymentIntent.metadata?.repairId;
        const clientId = paymentIntent.metadata?.clientId;

        if (repairId) {
          // Record payment in database
          await supabase.from("payments").upsert(
            {
              repair_id: repairId,
              stripe_payment_id: paymentIntent.id,
              amount: paymentIntent.amount / 100,
              status: "succeeded",
              paid_at: new Date(paymentIntent.created * 1000).toISOString(),
            },
            { onConflict: "stripe_payment_id" }
          );

          // Update repair status to accepted (payment complete)
          await supabase
            .from("repairs")
            .update({ status: "paid" })
            .eq("id", repairId);

          console.log(`Payment succeeded for repair ${repairId}`);

          // Trigger email notification (via separate email service)
          try {
            await fetch(new URL("/api/email", process.env.NEXT_PUBLIC_APP_URL), {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "payment_confirmed",
                data: { repairId, amount: paymentIntent.amount / 100 },
              }),
            });
          } catch (emailError) {
            console.error("Failed to send payment notification email:", emailError);
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        const repairId = paymentIntent.metadata?.repairId;

        if (repairId) {
          // Record failed payment
          await supabase.from("payments").upsert(
            {
              repair_id: repairId,
              stripe_payment_id: paymentIntent.id,
              status: "failed",
              error_message: paymentIntent.last_payment_error?.message,
            },
            { onConflict: "stripe_payment_id" }
          );

          console.log(`Payment failed for repair ${repairId}`);
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as any;

        // Check if account is fully onboarded
        if (account.charges_enabled && account.payouts_enabled) {
          // Find user with this Stripe account ID
          const { data: profile } = await supabase
            .from("profiles")
            .select("id")
            .eq("stripe_account_id", account.id)
            .single();

          if (profile) {
            // Update profile to mark onboarding complete
            await supabase
              .from("profiles")
              .update({ stripe_onboarded: true })
              .eq("id", profile.id);

            console.log(`Stripe account onboarded for user ${profile.id}`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
