import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

/**
 * Create a Stripe Connect account for a repairer
 */
export async function createStripeAccount(email: string, name: string) {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      business_profile: {
        name,
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
    });
    return account;
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    throw error;
  }
}

/**
 * Create account link for onboarding
 */
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const link = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: refreshUrl,
      return_url: returnUrl,
    });
    return link;
  } catch (error) {
    console.error("Error creating account link:", error);
    throw error;
  }
}

/**
 * Create a payment intent for a repair
 */
export async function createPaymentIntent(
  amount: number,
  repairerStripeId: string,
  clientId: string,
  repairId: string
) {
  try {
    // Amount should be in cents
    const amountCents = Math.round(amount * 100);
    // RepairHub takes 10% application fee
    const applicationFee = Math.round(amountCents * 0.1);

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: amountCents,
        currency: "usd",
        application_fee_amount: applicationFee,
        metadata: {
          repairId,
          clientId,
        },
      },
      {
        stripeAccount: repairerStripeId,
      }
    );

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

/**
 * Retrieve payout balance for a repairer
 */
export async function getAccountBalance(accountId: string) {
  try {
    const balance = await stripe.balance.retrieve({}, { stripeAccount: accountId });
    return balance;
  } catch (error) {
    console.error("Error retrieving balance:", error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
    return event;
  } catch (error) {
    console.error("Webhook verification error:", error);
    throw error;
  }
}
