import { NextRequest, NextResponse } from 'next/server'
import { createTestTransaction, createTestCustomer } from '@/lib/stripe-utils'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'usd' } = await request.json()

    if (!amount || amount < 0.50) {
      return NextResponse.json(
        { error: 'Amount must be at least $0.50' },
        { status: 400 }
      )
    }

    // Create a test customer first
    const customer = await createTestCustomer(
      `test-customer-${Date.now()}@example.com`,
      'Test Customer'
    )

    // Create a test payment intent
    const paymentIntent = await createTestTransaction(amount, currency)

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
      customer: {
        id: customer.id,
        email: customer.email,
      }
    })
  } catch (error) {
    console.error('Error creating test transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create test transaction' },
      { status: 500 }
    )
  }
}



