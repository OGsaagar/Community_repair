import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailData {
  to: string
  type:
    | 'bid_received'
    | 'bid_accepted'
    | 'repair_completed'
    | 'payment_confirmed'
    | 'review_requested'
  data?: Record<string, any>
}

const emailTemplates: Record<string, { subject: string; htmlFn: (data: any) => string }> = {
  bid_received: {
    subject: 'New bid on your repair request',
    htmlFn: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You have a new bid! 🎉</h2>
        <p>Hi ${data.clientName},</p>
        <p><strong>${data.repairerName}</strong> has placed a bid of <strong>$${data.amount}</strong> on your ${data.device} repair.</p>
        <p>Bid details:</p>
        <ul>
          <li><strong>Device:</strong> ${data.device}</li>
          <li><strong>Repairer:</strong> ${data.repairerName}</li>
          <li><strong>Bid amount:</strong> $${data.amount}</li>
          <li><strong>Estimated time:</strong> ${data.estimatedDays} days</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${data.repairId}" style="background-color: #1D4B20; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View Bid →</a></p>
        <p>Thanks,<br>The RepairHub Team</p>
      </div>
    `,
  },
  repair_completed: {
    subject: 'Your repair is complete! 🎉',
    htmlFn: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your ${data.device} repair is ready!</h2>
        <p>Hi ${data.clientName},</p>
        <p>Great news! <strong>${data.repairerName}</strong> has completed your repair.</p>
        <p>Next steps:</p>
        <ol>
          <li>Review the repair details and photos</li>
          <li>Pick up or arrange drop-off</li>
          <li>Leave a review to help other customers</li>
        </ol>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${data.repairId}" style="background-color: #1D4B20; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View Details →</a></p>
        <p>Thanks,<br>The RepairHub Team</p>
      </div>
    `,
  },
  payment_confirmed: {
    subject: 'Payment confirmed ✓',
    htmlFn: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Payment confirmed</h2>
        <p>Hi there,</p>
        <p>Your payment of <strong>$${data.amount}</strong> has been successfully processed.</p>
        <p>Repair ID: <strong>${data.repairId}</strong></p>
        <p>Your repair request is now active and repairers can start bidding on it.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${data.repairId}" style="background-color: #1D4B20; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View Repair →</a></p>
        <p>Thanks,<br>The RepairHub Team</p>
      </div>
    `,
  },
  bid_accepted: {
    subject: 'Your bid was accepted! 🎊',
    htmlFn: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations! Your bid was accepted.</h2>
        <p>Hi ${data.repairerName},</p>
        <p><strong>${data.clientName}</strong> has accepted your bid of <strong>$${data.amount}</strong> for the ${data.device} repair.</p>
        <p>Next steps:</p>
        <ol>
          <li>Contact the client to arrange pickup/drop-off</li>
          <li>Complete the repair</li>
          <li>Mark as complete when done</li>
        </ol>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${data.repairId}" style="background-color: #1D4B20; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">View Details →</a></p>
        <p>Make sure to provide great service to earn positive reviews!</p>
        <p>Thanks,<br>The RepairHub Team</p>
      </div>
    `,
  },
  review_requested: {
    subject: 'Please review your recent repair',
    htmlFn: (data) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>How was your experience?</h2>
        <p>Hi ${data.clientName},</p>
        <p>We'd love to hear about your experience with <strong>${data.repairerName}</strong> for your ${data.device} repair.</p>
        <p>Your feedback helps both the repairer improve and helps other customers make informed decisions.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/repairs/${data.repairId}" style="background-color: #1D4B20; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">Leave a Review →</a></p>
        <p>Thanks,<br>The RepairHub Team</p>
      </div>
    `,
  },
}

export async function sendEmail(params: EmailData) {
  try {
    const template = emailTemplates[params.type]

    if (!template) {
      console.error(`Unknown email template: ${params.type}`)
      return { error: 'Unknown template' }
    }

    const result = await resend.emails.send({
      from: 'RepairHub <hello@repairhub.app>',
      to: params.to,
      subject: template.subject,
      html: template.htmlFn(params.data || {}),
    })

    return result
  } catch (error) {
    console.error('Error sending email:', error)
    return { error: String(error) }
  }
}
