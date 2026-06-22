# CoachLink Navigation Structure

## Public Routes

| Route             | Description      |
| ----------------- | ---------------- |
| /                 | Splash Screen    |
| /welcome          | Welcome Screen   |
| /signin           | Sign In          |
| /signup           | Sign Up          |
| /forgot-password  | Forgot Password  |
| /verify-otp       | OTP Verification |
| /select-role      | Role Selection   |
| /complete-profile | Complete Profile |

---

# Athlete / Parent Routes

| Route            | Description      |
| ---------------- | ---------------- |
| /home            | Dashboard / Home |
| /search          | Search Coaches   |
| /coaches         | Coach Listing    |
| /coaches/:id     | Coach Details    |
| /booking-request | Request Session  |
| /payment         | Payment Screen   |
| /booking-success | Booking Success  |
| /bookings        | My Bookings      |
| /notifications   | Notifications    |
| /profile         | Profile          |
| /settings        | Settings         |

---

# Coach Routes

| Route          | Description              |
| -------------- | ------------------------ |
| /dashboard     | Coach Dashboard          |
| /requests      | Incoming Requests        |
| /requests/:id  | Request Details          |
| /availability  | Manage Availability      |
| /earnings      | Earnings Summary         |
| /coach-profile | Coach Profile Management |

---

# Athlete / Parent Bottom Navigation

Home

Search

Bookings

Notifications

Profile

---

# Coach Bottom Navigation

Dashboard

Requests

Availability

Profile

---

# Authentication Flow

Splash
→ Welcome
→ Sign Up / Sign In
→ Role Selection
→ Complete Profile
→ Home

---

# Discovery Flow

Home
→ Search Coaches
→ Coach Listing
→ Coach Details

---

# Booking Flow

Coach Details
→ Request Session
→ Coach Review
→ Payment
→ Booking Confirmation

---

# Coach Workflow

Dashboard
→ Incoming Requests
→ Accept / Decline
→ Booking Created

---

# MVP Geography

Launch Area:

Amuwo Odofin, Lagos

Discovery Filters:

* Sport
* Venue

Supported Venues:

* MU Court
* Festival Hotel Pool
* Golden Tulip Pool
* Appleton School
* Private Residence

No location-based routing or map navigation will be implemented in MVP.

---

# Role-Based Redirects

Athlete

Login
→ /home

Parent

Login
→ /home

Coach

Login
→ /dashboard

---

# Future Navigation (Version 2)

Potential Additional Routes:

* /messages
* /reviews
* /coach-subscriptions
* /children
* /maps
* /training-plans