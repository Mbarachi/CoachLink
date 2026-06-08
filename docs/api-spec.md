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

POST /booking-requests

GET /booking-requests

GET /booking-requests/:id

PATCH /booking-requests/:id

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