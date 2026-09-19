import QRCode from 'qrcode'
import type { TicketOrderWithDetails } from "@saima/shared";

type CheckInSection = {
    checkInUrl: string,
    checkInQr: string
};

type PrintedTicketInput = 
{
  checkIn: CheckInSection | undefined,
  order: {
    quantity: number
  }
  event: {
    title: string
    startsAt: string | undefined
    location: string | undefined
  }
  ticketType: {
    name: string
  }
}

function buildTicketCheckInUrl(token: string, webOrigin = window.location.origin) {
  const url = new URL('/dashboard/admin/ticket-checkin', webOrigin)
  url.searchParams.set('token', token)
  return url.toString()
}

async function checkInFromToken(qrToken: string)
{
    const checkInUrl = buildTicketCheckInUrl(qrToken)
    const dataUrl = await QRCode.toDataURL(checkInUrl, {
        errorCorrectionLevel: 'M',
        width: 320
    });
    return { checkInUrl: checkInUrl, checkInQr: dataUrl };
}

export async function printTicket(order: TicketOrderWithDetails)
{
    const checkIn = order.qrToken ? await checkInFromToken(order.qrToken) : undefined;
    const html = buildTicketPrintHtml({
        checkIn: checkIn,
        order: {
            quantity: order.quantity
        },
        event: {
            title: order.event?.title || "SAIMA",
            startsAt: order.event?.startsAt,
            location: order.event?.location
        },
        ticketType: {
            name: order.ticketType?.name || "Ticket"
        }
    });

    const iframe = document.createElement('iframe')
	  iframe.setAttribute('sandbox', 'allow-modals allow-same-origin allow-scripts')
	  iframe.setAttribute('src', '/print.html')
	  iframe.setAttribute('style', 'display: none')

	  document.body.appendChild(iframe)
	  const teardown = () => {
		  // Safari crashes without a timeout.
		  setTimeout(() => document.body.removeChild(iframe), 0);	  
    }
	  setTimeout(() => {
		  iframe.contentDocument!.write(html)

		  setTimeout(() => {
        iframe.contentWindow!.addEventListener('afterprint', teardown);
			  iframe.contentWindow!.focus()
			  iframe.contentWindow!.print()
		  }, 50);
	  }, 0);
}


export function buildTicketPrintHtml(input: PrintedTicketInput): string {
  const eventDate = input.event.startsAt ? formatDateTime(input.event.startsAt) : '';
  const subject = `Your ticket for ${input.event.title}`

  const checkInHtml = input.checkIn ?
  ` <p>Please show this QR code at the event entrance.</p>
    <p><img src="${input.checkIn.checkInQr}" alt="Ticket QR code" width="240" height="240"></p>
    <p>If the QR code does not display, use this check-in link: <a href="${escapeHtml(input.checkIn.checkInUrl)}">${escapeHtml(input.checkIn.checkInUrl)}</a></p>`
    : '';

  const html = `<!doctype html>
<html>
  <head><title>Your Ticket</title>
  <style> 
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  </style>
  <body style="font-family: Arial, sans-serif; color: #191715; line-height: 1.5;">
    <h1 style="font-size: 24px;">${escapeHtml(subject)}</h1>
    <p>
      <strong>${escapeHtml(input.event.title)}</strong><br>
      ${escapeHtml(input.ticketType.name)} x ${input.order.quantity}<br>
      ${escapeHtml(eventDate)}<br>
      ${escapeHtml(input.event.location ?? '')}<br>
    </p>
    ${checkInHtml}
  </body>
</html>`

  return html
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