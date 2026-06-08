# CoachLink MVP PRD v1.0

## Product Overview

CoachLink is a marketplace platform that connects athletes and parents with verified sports coaches.

The platform enables users to discover coaches, view profiles, request training sessions, make payments, and manage bookings.

The initial MVP focuses exclusively on Tennis and Swimming coaches.

---

# Problem Statement

Finding qualified sports coaches is fragmented and largely dependent on referrals, social media, and word-of-mouth.

Athletes and parents often struggle to:

* Find trusted coaches
* Compare coaching options
* Understand pricing
* Schedule sessions efficiently

Coaches similarly struggle to:

* Acquire new clients
* Showcase their experience
* Manage booking requests

CoachLink aims to solve these challenges through a simple marketplace experience.

---

# MVP Objectives

Validate the following assumptions:

1. Coaches are willing to create profiles on the platform.
2. Athletes and parents are willing to request coaching sessions through the platform.
3. Users are willing to complete payments through the platform.

---

# Supported Sports

The MVP will support only:

* Tennis
* Swimming

Additional sports are intentionally excluded.

---

# User Roles

## Athlete

Capabilities:

* Create account
* Browse coaches
* View coach profiles
* Request sessions
* Make payments
* Leave reviews

---

## Parent

Capabilities:

* Create account
* Browse coaches
* Request sessions for children
* Make payments
* Leave reviews

Child profiles are not supported in MVP.

Parents can provide child details during booking requests.

---

## Coach

Capabilities:

* Create coach profile
* Specify sport expertise
* Define pricing
* Manage availability
* Accept or reject requests
* Receive bookings

---

# MVP Scope

Included:

* Authentication
* Coach onboarding
* Coach discovery
* Coach profile pages
* Booking requests
* Booking management
* Payments
* Reviews
* Notifications

Excluded:

* AI recommendations
* Live chat
* Wallets
* Subscriptions
* Tournaments
* Video coaching
* Coach analytics
* Referral programs
* Social feeds

---

# Location Strategy

To reduce complexity and cost, the MVP will not use map-based discovery.

Coach locations will consist of:

* Country
* State
* Area

Examples:

* Lagos → Lekki
* Lagos → Ikoyi
* Lagos → Yaba

Users can filter coaches by area.

No Google Maps integration will be included in MVP.

---

# Booking Flow

Booking Model: Request-Based

User Flow:

1. User selects coach
2. User submits booking request
3. Coach reviews request
4. Coach accepts or declines
5. Payment is requested
6. User completes payment
7. Booking becomes confirmed

---

# Payment Flow

Payment Provider:

* Paystack

Flow:

Booking Request
→ Coach Accepts
→ Payment Required
→ Payment Completed
→ Booking Confirmed

No wallet functionality will be included.

---

# Authentication Flow

Splash
→ Welcome
→ Sign In / Sign Up
→ Role Selection
→ Complete Profile
→ Home

---

# Screen Inventory

## Public Screens

1. Splash
2. Welcome
3. Sign In
4. Sign Up
5. Forgot Password
6. OTP Verification
7. Role Selection

---

## Athlete / Parent Screens

8. Home
9. Search Coaches
10. Coach Details
11. Booking Request
12. Payment
13. Booking Success
14. My Bookings
15. Notifications
16. Profile
17. Settings

---

## Coach Screens

18. Dashboard
19. Incoming Requests
20. Request Details
21. Availability
22. Profile Management
23. Earnings Summary

---

# Database Entities

Core Entities:

* User
* CoachProfile
* Sport
* CoachSport
* BookingRequest
* Booking
* Payment
* Review
* Notification

---

# Technical Stack

Frontend:

* Ionic React
* Capacitor
* TypeScript

Backend:

* NestJS
* PostgreSQL

State Management:

* Zustand

Server State:

* React Query

Forms:

* React Hook Form
* Zod

Payments:

* Paystack

Media Storage:

* Cloudinary

---

# Success Metrics

The MVP will be considered successful if:

* Coaches complete onboarding
* Booking requests are created
* Booking requests are accepted
* Payments are completed
* Users make repeat bookings

Downloads alone are not considered success metrics.

---

# Future Roadmap

Version 2:

* Google Maps integration
* Child profiles
* In-app messaging
* Push notifications
* Coach subscriptions
* AI-powered coach recommendations

Version 3:

* Training plans
* Tournament management
* Coach analytics
* Video coaching
* Community features