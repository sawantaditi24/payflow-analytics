import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    // Fetch recent charges from Stripe
    const charges = await stripe.charges.list({
      limit: 20,
      expand: ['data.customer'],
    })

    // Transform Stripe data to our format
    const transactions = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100, // Convert from cents
      currency: charge.currency.toUpperCase(),
      status: charge.status,
      customer: charge.customer?.email || charge.billing_details?.email || 'Unknown',
      timestamp: new Date(charge.created * 1000).toISOString(),
      method: (charge as any).payment_method_details?.type || 'card',
      description: charge.description || 'Payment',
      receipt_url: charge.receipt_url,
    }))

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}
