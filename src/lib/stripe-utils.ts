import { stripe } from '@/lib/stripe'

export async function createTestTransaction(amount: number, currency: string = 'usd') {
  try {
    // Create a payment intent for testing
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      payment_method_types: ['card'],
      description: 'Test transaction for PayFlow Analytics',
      metadata: {
        source: 'payflow_analytics_demo'
      }
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating test transaction:', error)
    throw error
  }
}

export async function createTestCustomer(email: string, name: string) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'payflow_analytics_demo'
      }
    })

    return customer
  } catch (error) {
    console.error('Error creating test customer:', error)
    throw error
  }
}



