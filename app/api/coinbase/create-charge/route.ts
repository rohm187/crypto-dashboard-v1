import { NextRequest, NextResponse } from 'next/server';
import { Client, resources } from 'coinbase-commerce-node';

Client.init(process.env.COINBASE_COMMERCE_API_KEY ?? '');

const { Charge } = resources;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tier, amount } = body;
    const origin = request.headers.get('origin') ?? 'http://localhost:3000';

    // Determine product details based on tier
    let productName = 'Premium Trading Signals';
    let productDescription = 'Monthly subscription to advanced trading signals and market insights';
    let finalAmount = amount ? (amount / 100).toFixed(2) : '49.00'; // Default to $49

    if (tier === 'basic') {
      productName = 'Basic Trading Signals';
      productDescription = 'Live prices, basic signals, and educational content';
      finalAmount = '29.00';
    } else if (tier === 'pro') {
      productName = 'Pro Trading Signals';
      productDescription = 'Advanced signals, priority support, and custom alerts';
      finalAmount = '49.00';
    } else if (tier === 'elite') {
      productName = 'Elite Trading Signals';
      productDescription = 'Everything plus Discord access, API, and daily reports';
      finalAmount = '99.00';
    }

    const chargeData = {
      name: productName,
      description: productDescription,
      pricing_type: 'fixed_price' as const,
      local_price: {
        amount: finalAmount,
        currency: 'USD',
      },
      metadata: {
        product_type: 'premium_subscription',
        tier: tier || 'pro',
      },
      redirect_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    };

    const charge = await Charge.create(chargeData);

    return NextResponse.json({ 
      hosted_url: charge?.hosted_url,
      id: charge?.id 
    });
  } catch (error) {
    console.error('Error creating Coinbase charge:', error);
    return NextResponse.json(
      { error: 'Failed to create crypto payment charge' },
      { status: 500 }
    );
  }
}
