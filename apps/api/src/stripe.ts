import Stripe from 'stripe'

import { env } from './env'
import { supabaseAdmin } from './supabase'

let stripeClient: Stripe | null = null

export function getStripeClient() {
  if (!env.stripeSecretKey) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY.')
  }

  stripeClient ??= new Stripe(env.stripeSecretKey)
  return stripeClient
}

export async function handleStripeWebhook(request: Request) {
  if (!env.stripeWebhookSecret) {
    return new Response('Stripe webhook secret is not configured.', { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing Stripe signature.', { status: 400 })
  }

  const stripe = getStripeClient()
  const payload = await request.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, env.stripeWebhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid Stripe signature.'
    return new Response(message, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded':
      await confirmTicketOrderFromSession(event.data.object as Stripe.Checkout.Session)
      break
    case 'checkout.session.async_payment_failed':
    case 'checkout.session.expired':
      await cancelPendingTicketOrder(event.data.object as Stripe.Checkout.Session)
      break
  }

  return Response.json({ received: true })
}

export async function confirmTicketOrderFromSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') {
    return null
  }

  const orderId = session.metadata?.ticket_order_id ?? session.client_reference_id
  if (!orderId) {
    return null
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  const { data, error } = await supabaseAdmin
    .from('ticket_orders')
    .update({
      status: 'confirmed',
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      paid_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('status', 'pending_payment')
    .select('*')
    .maybeSingle()

  if (error) {
    throw error
  }

  return data
}

async function cancelPendingTicketOrder(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.ticket_order_id ?? session.client_reference_id
  if (!orderId) {
    return
  }

  const { error } = await supabaseAdmin
    .from('ticket_orders')
    .update({
      status: 'cancelled',
      stripe_checkout_session_id: session.id,
    })
    .eq('id', orderId)
    .eq('status', 'pending_payment')

  if (error) {
    throw error
  }
}
