export type CourseRow = {
  id: string
  member_id: string
  title: string
  summary: string
  instrument: string
  level: string
  location: string
  status: 'draft' | 'published' | 'archived'
  cover_image_key: string | null
  cover_image_url: string | null
  created_at: string
  updated_at: string
  profiles?: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  } | Array<{
    id: string
    full_name: string
    email: string
    avatar_url: string | null
  }> | null
}

export type CourseSlotRow = {
  id: string
  course_id: string
  member_id: string
  starts_at: string
  ends_at: string
  status: string
  created_at: string
}

export type TicketTypeRow = {
  id: string
  event_public_id: string
  name: string
  description: string | null
  price_cents: number
  currency: string
  capacity: number
  sale_starts_at: string | null
  sale_ends_at: string | null
  is_active: boolean
  created_at: string
}

export type TicketOrderRow = {
  id: string
  ticket_type_id: string
  event_public_id: string
  purchaser_user_id: string | null
  purchaser_name: string
  purchaser_email: string
  purchaser_phone: string | null
  quantity: number
  unit_price_cents: number
  total_price_cents: number
  status: 'pending_payment' | 'confirmed' | 'cancelled'
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  paid_at: string | null
  created_at: string
}

export type EventRow = {
  public_id: string
  title: string
  starts_at: string
}
