# CoachLink Mobile

Ionic React + Capacitor mobile app for the CoachLink coaching marketplace.

## Tech Stack

| Concern | Library |
|---|---|
| UI framework | Ionic React 8 + Capacitor 7 |
| Language | TypeScript 5 |
| Routing | `@ionic/react-router` (React Router v5 under the hood) |
| Server state | TanStack React Query 5 |
| Client state | Zustand 5 |
| Forms | React Hook Form 7 + Zod 3 |
| HTTP | Axios |
| Build | Vite 6 |

## Project Structure

```
src/
├── App.tsx                  # Root: providers + IonApp + router
├── main.tsx                 # React DOM entry point
├── theme/
│   └── variables.css        # Ionic custom-property brand tokens
├── lib/
│   ├── queryClient.ts       # TanStack QueryClient singleton
│   └── queryKeys.ts         # Centralised query-key factory
├── routes/
│   ├── AppRoutes.tsx        # Top-level router (public / athlete / coach)
│   ├── AthleteRoutes.tsx    # IonTabs for Athlete + Parent role
│   └── CoachRoutes.tsx      # IonTabs for Coach role
├── components/
│   └── ProtectedRoute.tsx   # Auth guard wrapper
├── pages/
│   ├── auth/                # Splash, Welcome, SignIn, SignUp, OTP, ForgotPassword, RoleSelection
│   ├── athlete/             # Home, Search, CoachDetails, BookingRequest, Payment,
│   │                        # BookingSuccess, MyBookings, Notifications, Profile, Settings
│   └── coach/               # Dashboard, IncomingRequests, RequestDetails,
│                            # Availability, ProfileManagement, EarningsSummary
├── store/
│   ├── auth.store.ts        # Zustand: user + accessToken (persisted)
│   └── ui.store.ts          # Zustand: global loading + toasts
├── services/
│   ├── api.ts               # Axios instance with auth + 401 interceptors
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── coaches.service.ts
│   ├── sports.service.ts
│   ├── bookingRequests.service.ts
│   ├── bookings.service.ts
│   ├── payments.service.ts
│   ├── reviews.service.ts
│   ├── notifications.service.ts
│   └── index.ts
└── types/
    ├── user.types.ts
    ├── coach.types.ts
    ├── booking.types.ts
    ├── payment.types.ts
    ├── review.types.ts
    ├── notification.types.ts
    └── index.ts
```

## Getting Started

```bash
cd mobile

# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit VITE_API_BASE_URL to point at your NestJS backend

# 3. Run in browser
npm run dev

# 4. Sync to native (after first build)
npm run build
npm run cap:sync

# 5. Open in Xcode / Android Studio
npm run cap:ios
npm run cap:android
```

## Navigation Map

```
/                       → redirect based on role
/splash                 → SplashPage
/welcome                → WelcomePage
/auth/signup            → SignUpPage
/auth/signin            → SignInPage
/auth/forgot-password   → ForgotPasswordPage
/auth/otp               → OtpVerificationPage
/auth/role              → RoleSelectionPage

/athlete/home                           → HomePage (tab)
/athlete/search                         → SearchCoachesPage (tab)
/athlete/coaches/:id                    → CoachDetailsPage
/athlete/booking-request/:coachId       → BookingRequestPage
/athlete/payment/:bookingRequestId      → PaymentPage
/athlete/booking-success/:bookingId     → BookingSuccessPage
/athlete/bookings                       → MyBookingsPage (tab)
/athlete/notifications                  → NotificationsPage (tab)
/athlete/profile                        → ProfilePage (tab)
/athlete/settings                       → SettingsPage

/coach/dashboard        → DashboardPage (tab)
/coach/requests         → IncomingRequestsPage (tab)
/coach/requests/:id     → RequestDetailsPage
/coach/availability     → AvailabilityPage (tab)
/coach/earnings         → EarningsSummaryPage
/coach/profile          → ProfileManagementPage (tab)
```
