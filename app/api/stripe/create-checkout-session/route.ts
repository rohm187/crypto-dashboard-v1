import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, amount, referralId } = body;
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    // Determine product details based on tier
    let productName = 'Premium Trading Signals';
    let productDescription = 'Access to advanced trading signals and market insights';
    let finalAmount = amount || 4900; // Default to $49 if not specified

    if (tier === 'basic') {
      productName = 'Basic Trading Signals';
      productDescription = 'Live prices, basic signals, and educational content';
      finalAmount = 2900; // $29
    } else if (tier === 'pro') {
      productName = 'Pro Trading Signals';
      productDescription = 'Advanced signals, priority support, and custom alerts';
      finalAmount = 4900; // $49
    } else if (tier === 'elite') {
      productName = 'Elite Trading Signals';
      productDescription = 'Everything plus Discord access, API, and daily reports';
      finalAmount = 9900; // $99
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: productDescription,
            },
            unit_amount: finalAmount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      client_reference_id: referralId || undefined,
      metadata: {
        tier: tier || 'pro',
        referral_id: referralId || '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
