import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import crypto from 'crypto';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { generateLicenseKey } from '@/lib/keygen';
import { sendLicenseEmail } from '@/lib/email';
import { encrypt } from '@/lib/crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  console.log(`Received Stripe webhook: ${event.type} for session ${session.id}`);

  if (event.type === 'checkout.session.completed') {
    const email = session.customer_email || session.metadata?.email;
    const plan = session.metadata?.plan;
    console.log(`Processing completion for: ${email}, Plan: ${plan}`);

    if (email && plan) {
      try {
        // Check if already processed to be idempotent
        const existingLicense = await prisma.license.findUnique({
          where: { stripeSessionId: session.id },
        });

        if (existingLicense) {
          console.log(`License already exists for session ${session.id}`);
          return new NextResponse(null, { status: 200 });
        }

        if (!existingLicense) {
          const key = generateLicenseKey();
          const keyHash = crypto.createHash('sha256').update(key).digest('hex');
          const encryptedKey = encrypt(key);

          // Plan-specific logic
          const isPlus = plan === 'PLUS';
          const expiresAt = isPlus ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null;
          const maxActivations = isPlus ? 1 : 5;

          await prisma.license.create({
            data: {
              email,
              plan, // 'PLUS' or 'PRO'
              keyHash,
              encryptedKey,
              stripeSessionId: session.id,
              status: 'active',
              expiresAt,
              maxActivations,
            },
          });

          await sendLicenseEmail(email, key, plan);
          // SECURITY: Do not log the key itself.
          console.log(`License generated and sent for ${email} (${plan})`);
        }
      } catch (error) {
        console.error('Error processing checkout session:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
      }
    } else {
      console.error('Missing email or plan in session metadata/customer details');
    }
  }

  return new NextResponse(null, { status: 200 });
}
