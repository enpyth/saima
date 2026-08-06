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

export type TicketOrderRow = {
  id: string
  ticket_type_id: string
  event_public_id: string
  purchaser_user_id: string | null
  purchaser_name: string
  purchaser_email: string
  purchaser_phone: string | null
  quantity: number
  capacity_units_per_ticket: number
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

export type PublicEventRow = EventRow & {
  id: string
  summary: string
  location: string
  is_published: boolean
  cover_image_key: string | null
  cover_image_url: string | null
}

export type ProfileRow = {
  id: string
  email: string
  role: 'visitor' | 'member' | 'admin'
  full_name: string
  phone?: string | null
  instruments?: string[] | null
  bio?: string | null
  country_or_region?: string | null
  public_profile?: boolean
  avatar_key?: string | null
  avatar_url?: string | null
  cover_image_key?: string | null
  cover_image_url?: string | null
  created_at?: string
  updated_at?: string
}

export type ProfileSummaryRow = {
  id: string
  email?: string | null
  full_name: string
  avatar_url?: string | null
  role?: 'visitor' | 'member' | 'admin'
}

export type MembershipApplicationRow = {
  id: string
  user_id: string
  full_name: string
  email: string
  instruments: string[]
  experience: string
  motivation: string
  status: 'pending' | 'approved' | 'rejected' | 'needs_info'
  created_at: string
  profiles?: ProfileSummaryRow | ProfileSummaryRow[] | null
}

export type BookingRow = {
  id: string
  course_id: string
  slot_id: string
  visitor_id: string
  status: 'confirmed' | 'cancelled' | 'completed'
  created_at: string
  profiles?: ProfileSummaryRow | ProfileSummaryRow[] | null
  courses?: {
    id: string
    title: string
    summary?: string
    instrument?: string
    level?: string
    location: string
    member_id?: string
    profiles?: ProfileSummaryRow | ProfileSummaryRow[] | null
  } | Array<{
    id: string
    title: string
    summary?: string
    instrument?: string
    level?: string
    location: string
    member_id?: string
    profiles?: ProfileSummaryRow | ProfileSummaryRow[] | null
  }> | null
  course_slots?: CourseSlotRow | CourseSlotRow[] | null
}
