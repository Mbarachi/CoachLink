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
* Define session pricing
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

The MVP will focus exclusively on Amuwo Odofin, Lagos.

Users will not search by city or area.

Instead, users will discover coaches by:

- Sport
- Coaching Venue

Examples:

- MU Court
- Festival Hotel Pool
- Golden Tulip Pool
- Private Residence
- School Facilities

This allows CoachLink to launch within a focused geographic area and validate demand before expanding to other parts of Lagos.

No Google Maps integration will be included in MVP.

---

# Launch Geography

Phase 1 Launch Area:

- Amuwo Odofin, Lagos

Future Expansion:

- Festac
- Surulere
- Lekki
- Ikoyi
- Victoria Island

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

# Pricing Strategy

Pricing Model:

Per Session

Coaches determine their own session rates.

CoachLink may provide recommended pricing guidance based on sport and experience level.

Example Recommended Ranges:

Swimming:
₦5,000 - ₦15,000 per session

Tennis:
₦7,500 - ₦20,000 per session

CoachLink does not enforce fixed pricing in MVP.

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

8.  Home
9.  Search Coaches
10. Coach Listing
11. Coach Details
12. Booking Request
13. Payment
14. Booking Success
15. My Bookings
16. Notifications
17. Profile
18. Settings

---

## Coach Screens

19. Dashboard
20. Incoming Requests
21. Request Details
22. Availability
23. Profile Management
24. Earnings Summary

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
* Coaches publish profiles
* Users discover coaches
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