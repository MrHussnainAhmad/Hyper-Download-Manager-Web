import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json();

    if (!email || !plan) {
      console.log('Checkout Error: Missing email or plan', { email, plan });
      return NextResponse.json({ error: 'Missing email or plan' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';
    console.log(`Starting checkout for ${email} (${plan}) from ${origin}`);

    let priceData;

    if (plan === 'PLUS') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'Hyper Download Manager - Plus Plan',
          description: 'Monthly subscription. Batch download, Speed limiter, Fewer ads (Image only).',
        },
        unit_amount: 499, // $4.99
        recurring: {
          interval: 'month' as const,
        },
      };
    } else if (plan === 'PRO') {
      priceData = {
        currency: 'usd',
        product_data: {
          name: 'Hyper Download Manager - Pro Plan',
          description: 'Lifetime license. No ads, 5 systems, Priority Support, Beta Updates, Max Speed.',
        },
        unit_amount: 2999, // $29.99
      };
    } else {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: plan === 'PLUS' ? 'subscription' : 'payment',
      success_url: `${origin}/purchase/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/purchase?canceled=true`,
      customer_email: email,
      metadata: {
        plan,
        email, // Storing here to access in webhook safely
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
