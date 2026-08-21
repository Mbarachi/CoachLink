# CoachLink API Specification

Base URL:

/api/v1

---

# Authentication

POST /auth/signup

POST /auth/signin

POST /auth/verify-otp

POST /auth/forgot-password

POST /auth/reset-password

---

# Users

GET /users/me

PATCH /users/me

---

# Coaches

GET /coaches

GET /coaches/:id

POST /coaches

PATCH /coaches/:id

---

# Sports

GET /sports

---

# Booking Requests

All routes require authentication.

POST /booking-requests
  Athlete or parent creates a request. Body carries mode, startDate,
  startTime, and for packages weeks + daysOfWeek.

GET /booking-requests?status=
  Role-scoped: a coach gets the requests sent to them, everyone else gets
  their own. status is an optional filter (EXPIRED is derived, so it is not
  a valid filter value).

GET /booking-requests/:id
  Participants only.

PATCH /booking-requests/:id
  { status } — the coach may set ACCEPTED or DECLINED, the athlete who
  booked may set CANCELLED. Only from PENDING.

---

# Bookings

GET /bookings

GET /bookings/:id

PATCH /bookings/:id

---

# Payments

POST /payments/initialize

POST /payments/webhook

GET /payments/:id

---

# Reviews

POST /reviews

GET /reviews/coach/:coachId

---

# Notifications

GET /notifications

PATCH /notifications/:id/read