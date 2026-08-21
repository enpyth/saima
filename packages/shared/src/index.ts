export const roles = ['visitor', 'member', 'admin'] as const

export type Role = (typeof roles)[number]

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_info'

export type CourseStatus = 'draft' | 'published' | 'archived'

export type SlotStatus = 'available' | 'booked'

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export type TicketOrderStatus = 'pending_payment' | 'confirmed' | 'cancelled'

export type TicketCheckInStatus = 'checked_in' | 'already_checked_in' | 'invalid'

export type TicketType = {
  id: string
  eventPublicId: string
  name: string
  description?: string | null
  priceCents: number
  currency: string
  capacity: number
  capacityUnitsPerTicket: number
  sold: number
  reserved: number
  remaining: number
  saleStartsAt?: string | null
  saleEndsAt?: string | null
  isActive: boolean
}

export type TicketInventory = {
  eventPublicId: string
  ticketTypeId: string
  slug: string
  sold: number
  reserved: number
  remaining: number
}

export type TicketSaleInventory = {
  eventPublicId: string
  eventTitle: string
  startsAt: string
  capacity: number
  ticketInventories: TicketInventory[]
}

export type TicketSaleStat = {
  eventPublicId: string
  eventTitle: string
  startsAt: string
  ticketTypeId: string
  ticketTypeName: string
  priceCents: number
  currency: string
  capacity: number
  capacityUnitsPerTicket: number
  sold: number
  reserved: number
  remaining: number
  revenueCents: number
}

export type FreeTicketRecipient = {
  id: string
  email: string
  fullName: string
}

export type FreeTicketOrderResult = {
  orderId: string
  emailSent: boolean
  emailError?: string
}

export type TicketSaleOverview = {
  totalCapacity: number
  totalSold: number
  totalRemaining: number
  totalRevenueCents: number
  sellThroughRate: number
}

export const defaultTicketQuantityLimit = 10
export const zeroCapacityTicketQuantityLimit = 100

export function getTicketQuantityLimit(capacityUnitsPerTicket: number) {
  return capacityUnitsPerTicket === 0 ? zeroCapacityTicketQuantityLimit : defaultTicketQuantityLimit
}

export type Profile = {
  id: string
  email: string
  fullName: string
  role: Role
  phone?: string | null
  instruments?: string[] | null
  bio?: string | null
  countryOrRegion?: string | null
  publicProfile: boolean
  avatarKey?: string | null
  avatarUrl?: string | null
  coverImageKey?: string | null
  coverImageUrl?: string | null
}

export type ProfileSummary = {
  id: string
  email?: string | null
  fullName: string
  avatarUrl?: string | null
  role?: Role
}

export type PublicEvent = {
  id: string
  publicId: string
  title: string
  summary: string
  startsAt: string
  location: string
  isPublished: boolean
  coverImageKey?: string | null
  coverImageUrl?: string | null
}

export type MembershipApplication = {
  id: string
  userId: string
  fullName: string
  email: string
  instruments: string[]
  experience: string
  motivation: string
  status: ApplicationStatus
  createdAt: string
}

export type MembershipApplicationWithProfile = MembershipApplication & {
  profile?: ProfileSummary | null
}

export type Course = {
  id: string
  memberId: string
  title: string
  summary: string
  instrument: string
  level: string
  location: string
  status: CourseStatus
  coverImageKey?: string | null
  coverImageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export type CourseSlot = {
  id: string
  courseId: string
  memberId: string
  startsAt: string
  endsAt: string
  status: SlotStatus
  createdAt?: string
}

export type CourseWithSlots = Course & {
  profile?: ProfileSummary | null
  courseSlots: CourseSlot[]
}

export type Booking = {
  id: string
  courseId: string
  slotId: string
  visitorId: string
  status: BookingStatus
  createdAt: string
}

export type BookingWithDetails = Booking & {
  profile?: ProfileSummary | null
  course?: Pick<Course, 'id' | 'title' | 'summary' | 'instrument' | 'level' | 'location' | 'memberId'> & {
    profile?: ProfileSummary | null
  } | null
  courseSlot?: CourseSlot | null
}

export type TicketOrderWithDetails = {
  id: string
  ticketTypeId: string
  eventPublicId: string
  purchaserUserId?: string | null
  purchaserName: string
  purchaserEmail: string
  purchaserPhone?: string | null
  quantity: number
  unitPriceCents: number
  totalPriceCents: number
  status: TicketOrderStatus
  stripeCheckoutSessionId?: string | null
  stripePaymentIntentId?: string | null
  paidAt?: string | null
  qrToken?: string | null
  confirmationEmailSentAt?: string | null
  confirmationEmailResendId?: string | null
  checkedInAt?: string | null
  checkedInBy?: string | null
  createdAt: string
  ticketType?: Pick<TicketType, 'id' | 'name' | 'description'> | null
  event?: {
    publicId: string
    title: string
    startsAt: string
    location: string
  } | null
}

export type TicketCheckInResult = {
  status: TicketCheckInStatus
  message: string
  ticket?: TicketOrderWithDetails
}

export type AdminUser = Pick<Profile, 'id' | 'email' | 'role' | 'publicProfile'> & {
  fullName: string
  createdAt: string
}

export function calculateTicketSaleOverview(stats: TicketSaleStat[]): TicketSaleOverview {
  const eventInventory = new Map<string, Pick<TicketSaleStat, 'capacity' | 'remaining'>>()

  for (const stat of stats) {
    const current = eventInventory.get(stat.eventPublicId)
    if (!current || stat.capacity > current.capacity) {
      eventInventory.set(stat.eventPublicId, {
        capacity: stat.capacity,
        remaining: stat.remaining,
      })
    }
  }

  const totalCapacity = [...eventInventory.values()].reduce((total, stat) => total + stat.capacity, 0)
  const totalRemaining = [...eventInventory.values()].reduce((total, stat) => total + stat.remaining, 0)
  const totalSold = stats.reduce((total, stat) => total + stat.sold * stat.capacityUnitsPerTicket, 0)
  const totalRevenueCents = stats.reduce((total, stat) => total + stat.revenueCents, 0)

  const overview = {
    totalCapacity,
    totalSold,
    totalRemaining,
    totalRevenueCents,
    sellThroughRate: 0,
  }

  return {
    ...overview,
    sellThroughRate:
      overview.totalCapacity === 0
        ? 0
        : Math.round((overview.totalSold / overview.totalCapacity) * 1000) / 10,
  }
}
