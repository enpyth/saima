import QRCode from 'qrcode'
import { Resend } from 'resend'

import { env } from '../env'
import { supabaseAdmin } from '../supabase'
import { getConfiguredTicketTypeById } from './ticket-types'
import type { EventRow, TicketOrderRow } from '../router/rows'
import { getRows } from '../router/supabase-result'

const qrContentId = 'ticket-qr'

let resendClient: Resend | null = null

type EmailTicketOrder = Pick<
  TicketOrderRow,
  | 'id'
  | 'ticket_type_id'
  | 'event_public_id'
  | 'purchaser_name'
  | 'purchaser_email'
  | 'quantity'
  | 'total_price_cents'
  | 'status'
  | 'qr_token'
  | 'confirmation_email_sent_at'
>

type ConfirmationEmailInput = {
  checkInUrl: string
  qrContentId: string
  order: {
    purchaserName: string
    quantity: number
    totalPriceCents: number
  }
  event: {
    title: string
    startsAt: string
    location: string
  }
  ticketType: {
    name: string
  }
}

export function buildTicketCheckInUrl(token: string, webOrigin = env.webOrigin) {
  const url = new URL('/dashboard/admin/ticket-checkin', webOrigin)
  url.searchParams.set('token', token)
  return url.toString()
}

export function shouldSendTicketConfirmationEmail(order: {
  status: TicketOrderRow['status']
  confirmationEmailSentAt?: string | null
}) {
  return order.status === 'confirmed' && !order.confirmationEmailSentAt
}

export function buildTicketConfirmationEmail(input: ConfirmationEmailInput) {
  const eventDate = formatDateTime(input.event.startsAt)
  const total = formatMoney(input.order.totalPriceCents)
  const subject = `Your ticket for ${input.event.title}`

  const html = `<!doctype html>
<html>
  <body style="font-family: Arial, sans-serif; color: #191715; line-height: 1.5;">
    <h1 style="font-size: 24px;">${escapeHtml(subject)}</h1>
    <p>Hi ${escapeHtml(input.order.purchaserName)}, your payment was successful.</p>
    <p>
      <strong>${escapeHtml(input.event.title)}</strong><br>
      ${escapeHtml(input.ticketType.name)} x ${input.order.quantity}<br>
      ${escapeHtml(eventDate)}<br>
      ${escapeHtml(input.event.location)}<br>
      Total: ${escapeHtml(total)}
    </p>
    <p>Please show this QR code at the event entrance.</p>
    <p><img src="cid:${input.qrContentId}" alt="Ticket QR code" width="240" height="240"></p>
    <p>If the QR code does not display, use this check-in link: <a href="${escapeHtml(input.checkInUrl)}">${escapeHtml(input.checkInUrl)}</a></p>
  </body>
</html>`

  const text = [
    subject,
    '',
    `Hi ${input.order.purchaserName}, your payment was successful.`,
    `${input.event.title}`,
    `${input.ticketType.name} x ${input.order.quantity}`,
    eventDate,
    input.event.location,
    `Total: ${total}`,
    '',
    `Check-in link: ${input.checkInUrl}`,
  ].join('\n')

  return { subject, html, text }
}

export async function sendTicketConfirmationEmail(order: EmailTicketOrder) {
  if (
    !shouldSendTicketConfirmationEmail({
      status: order.status,
      confirmationEmailSentAt: order.confirmation_email_sent_at,
    })
  ) {
    return null
  }

  if (!order.qr_token) {
    throw new Error('Ticket order is missing a QR token.')
  }

  if (!env.resendApiKey || !env.resendFromEmail) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.')
  }

  const ticketType = getConfiguredTicketTypeById(order.ticket_type_id)
  if (!ticketType) {
    throw new Error('Ticket type not found for confirmation email.')
  }

  const event = await getRows<EventRow & { location: string }>(
    supabaseAdmin
      .from('events')
      .select('public_id,title,starts_at,location')
      .eq('public_id', order.event_public_id)
      .single(),
  )
  const checkInUrl = buildTicketCheckInUrl(order.qr_token)
  const qrPng = await QRCode.toBuffer(checkInUrl, {
    errorCorrectionLevel: 'M',
    margin: 1,
    type: 'png',
    width: 320,
  })
  const email = buildTicketConfirmationEmail({
    checkInUrl,
    qrContentId,
    order: {
      purchaserName: order.purchaser_name,
      quantity: order.quantity,
      totalPriceCents: order.total_price_cents,
    },
    event: {
      title: event.title,
      startsAt: event.starts_at,
      location: event.location,
    },
    ticketType: {
      name: ticketType.name,
    },
  })

  resendClient ??= new Resend(env.resendApiKey)
  const { data, error } = await resendClient.emails.send({
    from: env.resendFromEmail,
    to: order.purchaser_email,
    subject: email.subject,
    html: email.html,
    text: email.text,
    attachments: [
      {
        filename: 'ticket-qr.png',
        content: qrPng,
        contentType: 'image/png',
        contentId: qrContentId,
      },
    ],
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.id) {
    throw new Error('Resend did not return an email id.')
  }

  const { error: updateError } = await supabaseAdmin
    .from('ticket_orders')
    .update({
      confirmation_email_sent_at: new Date().toISOString(),
      confirmation_email_resend_id: data.id,
    })
    .eq('id', order.id)
    .is('confirmation_email_sent_at', null)

  if (updateError) {
    throw updateError
  }

  return data.id
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
  }).format(cents / 100)
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
