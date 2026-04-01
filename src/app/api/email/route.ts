import { sendEmail, EmailData } from '@/lib/resend'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EmailData

    const { to, type, data } = body

    // Validate input
    if (!to || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Make sure the email type is valid
    const validTypes = ['bid_received', 'bid_accepted', 'repair_completed', 'payment_confirmed', 'review_requested']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid email type' }, { status: 400 })
    }

    // Send the email
    const result = await sendEmail({
      to,
      type: type as EmailData['type'],
      data,
    })

    // Type guard for error
    if (result && typeof result === 'object' && 'error' in result && result.error) {
      console.error('Error sending email:', result.error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Return success with id if present
    const emailId = (result as any)?.id || 'sent'
    return NextResponse.json({ success: true, id: emailId })
  } catch (error) {
    console.error('Email API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
