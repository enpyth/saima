import { os } from '@orpc/server'

import { adminUsersRouter } from './router/admin-users'
import { bookingsRouter } from './router/bookings'
import { availabilitySlotsRouter, coursesRouter, courseSlotsRouter } from './router/courses'
import { eventsRouter } from './router/events'
import { mediaRouter } from './router/media'
import { membershipApplicationsRouter } from './router/membership-applications'
import { profileRouter } from './router/profile'
import { ticketsRouter } from './router/tickets'

export const router = {
  health: os.handler(() => ({
    ok: true,
    name: 'saima-api',
  })),

  events: eventsRouter,
  tickets: ticketsRouter,
  profile: profileRouter,
  membershipApplications: membershipApplicationsRouter,
  courses: coursesRouter,
  courseSlots: courseSlotsRouter,
  availabilitySlots: availabilitySlotsRouter,
  bookings: bookingsRouter,
  media: mediaRouter,
  adminUsers: adminUsersRouter,
}

export type AppRouter = typeof router
