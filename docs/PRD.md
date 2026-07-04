# SAIMA Product Requirements Document

## 1. Product Summary

SAIMA is a local web system for the South Australian International Musicians Association. It provides a public website for unauthenticated visitors and role-based dashboards for visitors, members, and admins.

The first version focuses on association information, events, membership applications, course availability, and booking management.

## 2. Goals

- Present SAIMA clearly to the public before login.
- Let visitors sign in with Google or email magic link.
- Let visitors apply to become members.
- Let members publish available course or lesson times.
- Let visitors book available course or lesson slots.
- Let admins manage users, roles, membership applications, events, bookings, and permissions.

## 3. User Roles

### Anonymous Visitor

Users who are not logged in.

Core access:
- View the public website.
- Read the SAIMA introduction.
- Browse public events.
- Read membership information.
- Browse public courses or available learning opportunities.
- View contact information.

Restrictions:
- Cannot submit a membership application.
- Cannot book a course.
- Cannot access dashboards.

### Signed-In Visitor

Authenticated users who have not been approved as members.

Core access:
- Manage personal profile.
- Submit a membership application.
- Browse course availability.
- Book available course slots.
- Cancel own bookings.
- View upcoming bookings and booking history.

### Member

Approved association members.

Core access:
- Manage personal and public musician profile.
- Add instruments, bio, country or region, and public profile visibility.
- Publish course or lesson availability.
- View bookings made against their slots.
- Cancel or update their own availability.

### Admin

Association operators with full management permissions.

Core access:
- Manage users and roles.
- Review, approve, reject, or request more information for membership applications.
- Promote approved applicants to member.
- Manage public events.
- Manage all bookings and availability.
- Manage permissions.

## 4. Core Features

### Public Website

Required pages:
- Home / Introduction
- Events
- Membership
- Courses
- Contact

Requirements:
- These pages must be visible without login.
- Public pages must explain what SAIMA is, who it serves, and how to join.
- Events must be readable by everyone.
- Membership must explain benefits and direct users to sign in before applying.
- Courses must show available learning opportunities and require sign-in before booking.

### Authentication

Requirements:
- Use Supabase Auth.
- Support Google OAuth.
- Support email magic link.
- Use `http://localhost:3000/auth/callback` as the local callback URL.
- Create or sync a user profile after authentication.
- Assign initial admin access through the `ADMIN_EMAILS` environment variable.

### Membership Application

Requirements:
- Signed-in visitors can submit an application.
- Applications include full name, email, instruments, experience, and motivation.
- New applications start as `pending`.
- Admins can approve, reject, or mark applications as needing more information.
- Approved applications update the applicant role to `member`.

### Events

Requirements:
- Admins can create public events.
- Public users can read published events.
- Events include title, summary, start date/time, location, and published status.

### Course Availability

Requirements:
- Members can publish course or lesson slots.
- Slots include title, start time, end time, location, capacity, and status.
- Public users can browse available slots.
- Only signed-in users can book slots.

### Bookings

Requirements:
- Signed-in visitors can book available slots.
- Visitors can view their own bookings and history.
- Members can view bookings for their own slots.
- Admins can view all bookings.
- The system must prevent booking unavailable, cancelled, or already-booked slots.

### Dashboards

Required dashboards:
- Visitor dashboard
- Member dashboard
- Admin dashboard

Requirements:
- Dashboard navigation should be role-aware.
- Visitor dashboard focuses on profile, membership application, bookings, and history.
- Member dashboard focuses on profile, availability, and bookings received.
- Admin dashboard focuses on users, roles, applications, events, permissions, and operational oversight.

## 5. Data Model

Core entities:
- `profiles`
- `events`
- `membership_applications`
- `availability_slots`
- `bookings`

Core enums:
- Roles: `visitor`, `member`, `admin`
- Application status: `pending`, `approved`, `rejected`, `needs_info`
- Slot status: `available`, `booked`, `cancelled`
- Booking status: `confirmed`, `cancelled`, `completed`

## 6. Non-Goals for Version 1

The following are intentionally outside the first version:
- Payments
- Membership renewals
- Event ticketing
- Recurring availability rules
- Waitlists
- Email/SMS notifications
- Newsletter management
- Advanced member directory search
- File uploads and media gallery management

## 7. Success Criteria

- Anonymous users can access introduction, events, membership, courses, and contact pages.
- Users can authenticate through Supabase Google OAuth or email magic link.
- Signed-in visitors can submit membership applications.
- Admins can approve applications and grant member access.
- Members can publish course availability.
- Visitors can book available course slots.
- Admins can manage users, roles, applications, events, and bookings.
- Local development runs with web on `localhost:3000` and API on `localhost:3001`.

## 8. Technical Scope

Required stack:
- Bun
- Turborepo
- TanStack Start for the web app
- Elysia for the API server
- oRPC for type-safe API procedures
- Supabase for authentication and database

Local deployment:
- Web app runs on port `3000`.
- API server runs on port `3001`.
- Hosted Supabase credentials are provided through local `.env` files.
