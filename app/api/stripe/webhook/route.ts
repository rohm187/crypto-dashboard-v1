import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature') ?? '';

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event?.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Save subscription to database
        if (session?.customer && session?.subscription) {
          try {
            await prisma.subscription.create({
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                stripePriceId: session?.line_items?.data?.[0]?.price?.id ?? '',
                status: 'active',
                stripeCurrentPeriodEnd: session?.expires_at
                  ? new Date(session.expires_at * 1000)
                  : null,
                user: {
                  connectOrCreate: {
                    where: {
                      email: session?.customer_details?.email ?? '',
                    },
                    create: {
                      email: session?.customer_details?.email ?? '',
                      name: session?.customer_details?.name ?? null,
                    },
                  },
                },
              },
            });
          } catch (dbError) {
            console.error('Database error:', dbError);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: subscription.status,
              stripePriceId: subscription?.items?.data?.[0]?.price?.id ?? '',
              stripeCurrentPeriodEnd: (subscription as any)?.current_period_end
                ? new Date((subscription as any).current_period_end * 1000)
                : null,
            },
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        try {
          await prisma.subscription.update({
            where: {
              stripeSubscriptionId: subscription.id,
            },
            data: {
              status: 'canceled',
            },
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event?.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}