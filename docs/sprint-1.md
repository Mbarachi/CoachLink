# Sprint 1 - Authentication & Onboarding

## Sprint Goal

Build the complete Authentication and Onboarding experience for CoachLink.

At the end of Sprint 1, a user should be able to:

Welcome
→ Sign Up
→ Select Role
→ Complete Profile
→ Home

No backend integration is required.

Use mock services and local state only.

---

# Scope

Included:

* Welcome Screen
* Sign In Screen
* Sign Up Screen
* Forgot Password Screen
* Role Selection Screen
* Complete Profile Screen
* Home Placeholder Screen

Excluded:

* Coach Discovery
* Bookings
* Payments
* Reviews
* Notifications
* Messaging
* Backend APIs

---

# Technical Requirements

Framework:

* Ionic React
* TypeScript

Libraries:

* React Hook Form
* Zod
* Zustand
* React Router

Architecture:

* Feature-based structure
* Reusable UI components

---

# Design System

Colors:

Primary: #6FCF97
Secondary: #2D3748
Accent: #4A90E2

Background: #F8FAFC
Surface: #FFFFFF

Success: #6FCF97
Warning: #F4B740
Error: #EB5757

Border: #E2E8F0

Text Main: #1F2937
Text Light: #64748B

Font Family:
Poppins

---

# User Flow

Welcome
↓
Sign Up / Sign In
↓
Role Selection
↓
Complete Profile
↓
Home

---

# Screen 1 - Welcome

Route:
/welcome

Components:

* Logo
* Headline
* Supporting Text
* Get Started Button
* Sign In Button

Actions:

Get Started
→ Sign Up

Sign In
→ Sign In Screen

---

# Screen 2 - Sign Up

Route:
/signup

Fields:

* First Name
* Last Name
* Email
* Phone Number
* Password
* Confirm Password

Validation:

* Required fields
* Valid email
* Password confirmation

Actions:

Submit
→ Role Selection

---

# Screen 3 - Sign In

Route:
/signin

Fields:

* Email or Phone
* Password

Actions:

Sign In
→ Home

Forgot Password
→ Forgot Password Screen

Create Account
→ Sign Up Screen

---

# Screen 4 - Forgot Password

Route:
/forgot-password

Fields:

* Email

Actions:

Send Reset Link

Success Message:

Reset link sent.

---

# Screen 5 - Role Selection

Route:
/select-role

Options:

* Athlete
* Parent
* Coach

Requirements:

Store selected role in Zustand.

Actions:

Continue
→ Complete Profile

---

# Screen 6 - Complete Profile

Athlete / Parent:

Fields:

* Profile Photo
* Full Name
* Area
* Preferred Sport

Coach:

Fields:

* Profile Photo
* Full Name
* Sport
* Years of Experience
* Area
* Hourly Rate
* Bio

Requirements:

Render fields dynamically based on selected role.

Actions:

Continue
→ Home

---

# Screen 7 - Home Placeholder

Route:
/home

Display:

* Welcome message
* User role
* Preferred sport
* Quick action cards

Purpose:

Validate onboarding flow completion.

No business logic required.

---

# Reusable Components

Create:

* AppButton
* AppInput
* AppCard
* AppAvatar
* AppPageHeader

Use throughout all screens.

---

# Sprint Exit Criteria

Sprint 1 is complete when:

A new user can navigate through:

Welcome
→ Sign Up
→ Role Selection
→ Complete Profile
→ Home

without errors.

All forms must use:

* React Hook Form
* Zod validation

All screens must follow the approved design system.