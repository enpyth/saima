import { getTicketQuantityLimit, type TicketInventory } from '@saima/shared'
import { Ticket } from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent } from 'react'

import type { Language } from '../content/types'
import { api } from '../lib/orpc'
import { getTicketSaleConfig, getTicketSaleOptions, type TicketSaleConfigOption } from '../lib/ticket-sales-config'
import { useAuth } from './auth-provider'
import { useLanguage } from './language-provider'
import { Button } from './ui/button'

type TicketSaleLabels = {
  eyebrow: string
  title: string
  summary: string
  ticketType: string
  quantity: string
  name: string
  email: string
  phone: string
  submit: string
  loading: string
  checkout: string
  signIn: string
  soldOut: string
  checking: string
  remaining: string
  seatsPerTicket: string
  total: string
  success: string
  unavailable: string
}

const ticketSaleLabelsByLanguage = {
  zh: {
    eyebrow: '售票',
    title: '购买音乐会门票',
    summary: '选择票种并留下联系方式。提交后，系统会为你确认门票数量。',
    ticketType: '票种',
    quantity: '数量',
    name: '姓名',
    email: '邮箱',
    phone: '电话',
    submit: '确认购票',
    loading: '正在载入',
    checkout: '前往 Stripe 安全付款',
    signIn: '请先登录后购票。',
    soldOut: '门票已售罄',
    checking: '正在确认余票',
    remaining: '剩余',
    seatsPerTicket: '每张占用名额',
    total: '合计',
    success: '正在跳转到 Stripe 安全付款页面。',
    unavailable: '当前没有可售票种。',
  },
  en: {
    eyebrow: 'Tickets',
    title: 'Buy concert tickets',
    summary: 'Choose a ticket type and leave your contact details. Your ticket quantity is confirmed on submission.',
    ticketType: 'Ticket type',
    quantity: 'Quantity',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    submit: 'Confirm tickets',
    loading: 'Loading',
    checkout: 'Continue to secure Stripe payment',
    signIn: 'Sign in before buying tickets.',
    soldOut: 'Sold out',
    checking: 'Checking availability',
    remaining: 'remaining',
    seatsPerTicket: 'seats per ticket',
    total: 'Total',
    success: 'Redirecting to Stripe secure payment.',
    unavailable: 'No ticket types are currently available.',
  },
} satisfies Record<Language, TicketSaleLabels>

export function TicketSaleModule({ eventPublicId }: { eventPublicId: string }) {
  const { language } = useLanguage()
  const labels = ticketSaleLabelsByLanguage[language]
  const ticketSale = useTicketSale(eventPublicId, labels)

  return (
    <section className="public-section ticket-sale-section" id="tickets">
      <div className="section-heading">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2>{labels.title}</h2>
        <p>{labels.summary}</p>
      </div>
      <div className="ticket-sale-layout">
        <TicketSaleSummary labels={labels} loading={ticketSale.loading} ticketRows={ticketSale.ticketRows} />
        <TicketSaleForm labels={labels} ticketSale={ticketSale} />
      </div>
    </section>
  )
}

type TicketSaleState = ReturnType<typeof useTicketSale>

function useTicketSale(eventPublicId: string, labels: TicketSaleLabels) {
  const { profile, user } = useAuth()
  const ticketSale = useMemo(() => getTicketSaleConfig(eventPublicId), [eventPublicId])
  const ticketOptions = useMemo(() => getTicketSaleOptions(eventPublicId), [eventPublicId])
  const [ticketInventories, setTicketInventories] = useState<TicketInventory[]>([])
  const [selectedTicketTypeSlug, setSelectedTicketTypeSlug] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [purchaserName, setPurchaserName] = useState('')
  const [purchaserEmail, setPurchaserEmail] = useState('')
  const [purchaserPhone, setPurchaserPhone] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (profile?.fullName && !purchaserName) {
      setPurchaserName(profile.fullName)
    }
    if (user?.email && !purchaserEmail) {
      setPurchaserEmail(user.email)
    }
  }, [profile?.fullName, purchaserEmail, purchaserName, user?.email])

  useEffect(() => {
    if (ticketOptions.length === 0) {
      setSelectedTicketTypeSlug('')
      return
    }
    if (!ticketOptions.some((ticketOption) => ticketOption.slug === selectedTicketTypeSlug)) {
      setSelectedTicketTypeSlug(ticketOptions[0]?.slug ?? '')
    }
  }, [selectedTicketTypeSlug, ticketOptions])

  useEffect(() => {
    let mounted = true

    async function loadSale() {
      setLoading(true)
      try {
        const sale = await api.tickets.saleForEvent({ eventPublicId })
        if (!mounted) {
          return
        }
        setTicketInventories(sale.ticketInventories)
      } catch (error) {
        if (mounted) {
          setMessage(error instanceof Error ? error.message : labels.unavailable)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadSale()

    return () => {
      mounted = false
    }
  }, [eventPublicId, labels.unavailable])

  const ticketRows = useMemo(() => mergeTicketRows(ticketOptions, ticketInventories, ticketSale?.currency ?? 'AUD'), [
    ticketInventories,
    ticketOptions,
    ticketSale?.currency,
  ])
  const selectedTicketType = useMemo(
    () => ticketRows.find((ticketType) => ticketType.slug === selectedTicketTypeSlug),
    [selectedTicketTypeSlug, ticketRows],
  )
  const maxQuantity = Math.min(
    selectedTicketType?.remainingTicketQuantity ?? 0,
    getTicketQuantityLimit(selectedTicketType?.capacityUnitsPerTicket ?? 1),
  )
  const total = (selectedTicketType?.priceCents ?? 0) * quantity
  const selectedCapacityUnits = selectedTicketType?.capacityUnitsPerTicket ?? 1
  const selectedTicketTypeUnavailable =
    !selectedTicketType?.ticketTypeId ||
    selectedTicketType.remaining === null ||
    selectedTicketType.remaining < selectedCapacityUnits ||
    quantity > maxQuantity

  function selectTicketType(slug: string) {
    setSelectedTicketTypeSlug(slug)
    setQuantity(1)
  }

  async function submitTicketOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTicketType?.ticketTypeId || selectedTicketType.remaining === null) {
      setMessage(labels.unavailable)
      return
    }
    if (selectedTicketType.remaining < selectedTicketType.capacityUnitsPerTicket * quantity) {
      setMessage(labels.soldOut)
      return
    }
    if (!user) {
      setMessage(labels.signIn)
      window.location.href = '/login'
      return
    }

    setSubmitting(true)
    try {
      const session = await api.tickets.createCheckoutSession({
        ticketTypeId: selectedTicketType.ticketTypeId,
        purchaserName,
        purchaserEmail,
        purchaserPhone: purchaserPhone || undefined,
        quantity,
      })
      setMessage(labels.success)
      window.location.href = session.checkoutUrl
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not start Stripe Checkout.')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    loading,
    maxQuantity,
    message,
    purchaserEmail,
    purchaserName,
    purchaserPhone,
    quantity,
    selectedTicketType,
    selectedTicketTypeSlug,
    selectedTicketTypeUnavailable,
    submitting,
    ticketRows,
    total,
    selectTicketType,
    setPurchaserEmail,
    setPurchaserName,
    setPurchaserPhone,
    setQuantity,
    submitTicketOrder,
  }
}

function TicketSaleSummary({
  labels,
  loading,
  ticketRows,
}: {
  labels: TicketSaleLabels
  loading: boolean
  ticketRows: TicketSaleRow[]
}) {
  return (
    <div className="ticket-sale-summary">
      <Ticket size={42} aria-hidden="true" />
      {loading ? <p>{labels.loading}</p> : null}
      {!loading && ticketRows.length === 0 ? <p>{labels.unavailable}</p> : null}
      {ticketRows.map((ticketType) => (
        <TicketTypeRow key={ticketType.slug} labels={labels} ticketType={ticketType} />
      ))}
    </div>
  )
}

function TicketTypeRow({ labels, ticketType }: { labels: TicketSaleLabels; ticketType: TicketSaleRow }) {
  return (
    <div className="ticket-type-row">
      <div>
        <strong>{ticketType.name}</strong>
        {ticketType.description ? <span>{ticketType.description}</span> : null}
        {ticketType.capacityUnitsPerTicket > 1 ? (
          <span>
            {ticketType.capacityUnitsPerTicket} {labels.seatsPerTicket}
          </span>
        ) : null}
      </div>
      <div>
        <strong>{formatMoney(ticketType.priceCents, ticketType.currency)}</strong>
        <span>{getAvailabilityLabel(ticketType, labels)}</span>
      </div>
    </div>
  )
}

function TicketSaleForm({ labels, ticketSale }: { labels: TicketSaleLabels; ticketSale: TicketSaleState }) {
  return (
    <form className="form ticket-sale-form" onSubmit={ticketSale.submitTicketOrder}>
      <div className="field">
        <label htmlFor="ticketType">{labels.ticketType}</label>
        <select
          id="ticketType"
          value={ticketSale.selectedTicketTypeSlug}
          onChange={(event) => ticketSale.selectTicketType(event.currentTarget.value)}
          required
        >
          {ticketSale.ticketRows.map((ticketType) => (
            <option
              key={ticketType.slug}
              value={ticketType.slug}
              disabled={!ticketType.ticketTypeId || ticketType.remainingTicketQuantity < 1}
            >
              {ticketType.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="ticketQuantity">{labels.quantity}</label>
        <input
          id="ticketQuantity"
          type="number"
          min="1"
          max={Math.max(ticketSale.maxQuantity, 1)}
          value={ticketSale.quantity}
          onChange={(event) => ticketSale.setQuantity(Math.max(Number(event.currentTarget.value), 1))}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="purchaserName">{labels.name}</label>
        <input
          id="purchaserName"
          value={ticketSale.purchaserName}
          onChange={(event) => ticketSale.setPurchaserName(event.currentTarget.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="purchaserEmail">{labels.email}</label>
        <input
          id="purchaserEmail"
          type="email"
          value={ticketSale.purchaserEmail}
          onChange={(event) => ticketSale.setPurchaserEmail(event.currentTarget.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="purchaserPhone">{labels.phone}</label>
        <input
          id="purchaserPhone"
          value={ticketSale.purchaserPhone}
          onChange={(event) => ticketSale.setPurchaserPhone(event.currentTarget.value)}
        />
      </div>
      <div className="ticket-total-row">
        <span>{labels.total}</span>
        <strong>{formatMoney(ticketSale.total, ticketSale.selectedTicketType?.currency ?? 'AUD')}</strong>
      </div>
      {ticketSale.message ? <p className="muted">{ticketSale.message}</p> : null}
      <Button type="submit" disabled={ticketSale.submitting || ticketSale.selectedTicketTypeUnavailable}>
        {ticketSale.submitting ? labels.loading : labels.checkout}
      </Button>
    </form>
  )
}

type TicketSaleRow = TicketSaleConfigOption & {
  currency: string
  ticketTypeId: string | null
  sold: number
  reserved: number
  remaining: number | null
  remainingTicketQuantity: number
}

function mergeTicketRows(
  ticketOptions: TicketSaleConfigOption[],
  ticketInventories: TicketInventory[],
  currency: string,
): TicketSaleRow[] {
  const inventoriesBySlug = new Map(ticketInventories.map((inventory) => [inventory.slug, inventory]))

  return ticketOptions.map((ticketOption) => {
    const inventory = inventoriesBySlug.get(ticketOption.slug)
    const remaining = inventory?.remaining ?? null
    const remainingTicketQuantity =
      remaining === null
        ? 0
        : ticketOption.capacityUnitsPerTicket === 0
          ? getTicketQuantityLimit(ticketOption.capacityUnitsPerTicket)
          : Math.floor(remaining / ticketOption.capacityUnitsPerTicket)

    return {
      ...ticketOption,
      currency,
      ticketTypeId: inventory?.ticketTypeId ?? null,
      sold: inventory?.sold ?? 0,
      reserved: inventory?.reserved ?? 0,
      remaining,
      remainingTicketQuantity,
    }
  })
}

function getAvailabilityLabel(ticketType: TicketSaleRow, labels: TicketSaleLabels) {
  if (ticketType.remaining === null) {
    return labels.checking
  }

  return ticketType.remainingTicketQuantity > 0 ? `${ticketType.remainingTicketQuantity} ${labels.remaining}` : labels.soldOut
}

function formatMoney(cents: number, currency: string) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(cents / 100)
}
