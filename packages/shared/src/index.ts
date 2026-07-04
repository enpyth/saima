export const roles = ['visitor', 'member', 'admin'] as const

export type Role = (typeof roles)[number]

export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'needs_info'

export type CourseStatus = 'draft' | 'published' | 'archived'

export type SlotStatus = 'available' | 'booked'

export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

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

export type PublicEvent = {
  id: string
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
}

export type Booking = {
  id: string
  courseId: string
  slotId: string
  visitorId: string
  status: BookingStatus
  createdAt: string
}
