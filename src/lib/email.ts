import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send bid received email to client
 */
export async function sendBidReceivedEmail(
  clientEmail: string,
  repairerName: string,
  deviceInfo: string,
  bidAmount: number,
  repairId: string
) {
  const html = `
    <h2>You have a new bid!</h2>
    <p>${repairerName} has submitted a bid for your ${deviceInfo} repair.</p>
    <p><strong>Bid Amount:</strong> $${bidAmount.toFixed(2)}</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${repairId}">
        View Bid
      </a>
    </p>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `New bid for your ${deviceInfo} repair`,
    html,
  });
}

/**
 * Send repair accepted email
 */
export async function sendRepairAcceptedEmail(
  repairerEmail: string,
  clientName: string,
  deviceInfo: string,
  repairId: string
) {
  const html = `
    <h2>Repair accepted!</h2>
    <p>Great news! ${clientName} has accepted your bid.</p>
    <p><strong>Device:</strong> ${deviceInfo}</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${repairId}">
        View Repair Details
      </a>
    </p>
  `;

  return sendEmail({
    to: repairerEmail,
    subject: "Your bid has been accepted",
    html,
  });
}

/**
 * Send repair completed email
 */
export async function sendRepairCompletedEmail(
  clientEmail: string,
  repairerName: string,
  deviceInfo: string,
  repairId: string
) {
  const html = `
    <h2>Your repair is complete!</h2>
    <p>${repairerName} has completed your ${deviceInfo} repair.</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${repairId}">
        View Details & Complete Payment
      </a>
    </p>
  `;

  return sendEmail({
    to: clientEmail,
    subject: `Your ${deviceInfo} repair is ready`,
    html,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  amount: number,
  repairId: string
) {
  const html = `
    <h2>Payment confirmed!</h2>
    <p>You have successfully paid <strong>$${amount.toFixed(2)}</strong> for repair #${repairId}.</p>
    <p>Thank you for using RepairHub!</p>
  `;

  return sendEmail({
    to: email,
    subject: "Payment confirmation",
    html,
  });
}

/**
 * Generic email sender
 */
async function sendEmail({ to, subject, html }: EmailParams) {
  try {
    const result = await resend.emails.send({
      from: "noreply@repairhub.local",
      to,
      subject,
      html,
    });

    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
