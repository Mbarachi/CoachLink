# Handoff: CoachLink MVP — "Clay" Direction

## Overview
CoachLink is a marketplace that connects athletes and parents with verified **swimming and
tennis** coaches in **Amuwo Odofin, Lagos**. Athletes browse coaches, send a session **request**,
and only **pay after the coach accepts** (request-then-pay; payment via Paystack). Coaches manage
their profile, availability, incoming requests, and earnings. There is **no in-app chat** in the MVP.

This bundle contains the **"Clay" visual direction**: a warm, classy, athletic look — cream canvas,
terracotta accent, dark-brown ink, soft rounded cards.

## About the Design Files
The file in this bundle (`CoachLink Clay.dc.html`) is a **design reference created in HTML** — a
clickable prototype showing the intended look, screen inventory, and flow. **It is not production
code to copy directly.** Your task is to **recreate this design in the target codebase's existing
environment** (React Native / Expo, Flutter, native iOS/Android, or web — whatever the project
uses), following that codebase's established patterns, component library, and conventions. If no
codebase exists yet, choose the most appropriate mobile framework and implement there.

> ⚠️ **Note on the file format:** the `.dc.html` file uses a small custom runtime (`support.js`)
> with `<sc-if>` / `<sc-for>` template tags and a `class Component` logic block. This is a
> prototyping convention only — **do not port the runtime.** Read it purely to extract the
> structure, styles, copy, and state model described below.

## ⭐ The Specific Ask: Restyle, Don't Re-architect
The architecture, screen inventory, navigation flow, component structure, layout, spacing, and
copy are **final and should be preserved**. What is open for redefinition is the **visual skin**:

**SAFE to redefine (the "theme" layer):**
- Color palette (all values are listed under **Design Tokens → Color**)
- Typography (font families, and if desired the weight/size scale)
- Accent color and on-accent text color
- Border-radius scale, shadow style, border treatment
- Icon style

**PRESERVE (the "system" layer):**
- The screen inventory and what each screen does (**Screens / Views**)
- The navigation graph and request-then-pay flow (**Interactions & Behavior**)
- The state model (**State Management**)
- Layout structure of each screen (header / scroll body / sticky footer / bottom tab bar), the
  card-based list patterns, and the relative hierarchy/sizing of elements
- All copy/content (exact text is in the prototype)

> Practical guidance: implement the theme as a **single source of truth** (a theme object / design
> tokens / CSS variables) so swapping the palette or type later touches one file, not every screen.
> The prototype hardcodes values inline for prototyping speed — in the real codebase, tokenize them.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are all specified.
Recreate the UI faithfully using the codebase's existing libraries — but per the ask above, the
team intends to redefine the color/type tokens, so wire those through a theme rather than
hardcoding.

## Screens / Views

The app has three role areas. The prototype includes a developer-only side "navigator" panel and a
phone frame — **both are prototyping chrome; ignore them.** Only the screens inside the phone are
real.

### A. Public & Auth
1. **Splash** — Brand mark centered on a dark-brown field; taps through to Welcome.
2. **Welcome** — Logo, hero image slot, headline "Coaching, close to home.", subcopy, primary
   "Create an account" + text "I already have an account".
3. **Sign in** — Email + password fields, "Forgot password?", primary "Sign in", footer link to sign up.
4. **Sign up** — Full name, email, password; primary "Continue"; footer link to sign in.
5. **Forgot password** — Email field; "Send code".
6. **OTP verification** — 6 single-digit boxes (3 filled), resend countdown, "Verify".
7. **Role selection** — Three large tappable cards: Athlete / Parent / Coach. Choosing Athlete or
   Parent → Home; Coach → Coach Dashboard.

### B. Athlete & Parent
8. **Home** — Location header + notification bell; "Find a coach" title; search field (tap → Search);
   horizontal "Browse by sport" cards (Swimming / Tennis / All venues); "Top coaches near you" list;
   bottom tab bar (Home / Search / Bookings / Alerts / Profile).
9. **Search** — Active search field; sport filter chips; venue chips; results list of coach cards.
10. **Coach listing** — Back header; result count + sort; richer coach cards (thumbnail, name, price,
    rating, venue, distance).
11. **Coach details** — Photo header (back + favorite), avatar, name + verified check, sport/venue,
    rating, 3 stat tiles (Experience / Sessions / Rating), About, Training venue, Pricing card
    (per-session), Reviews; sticky footer with price + "Request session".
12. **Booking request** — Coach summary; **(parent role only)** child name/age fields; date picker
    row; time-slot chips; optional note textarea; info note "You'll only pay after … accepts";
    sticky "Send request".
13. **Payment** — Total-due card; fee breakdown; pay-with options (Card · Paystack selected / Bank
    transfer); secured-by note; sticky "Pay ₦X". Reached **after** a coach accepts.
14. **Success** — Two variants on the same screen: **Request sent** (after sending request) and
    **Booking confirmed** (after payment). Buttons: "View my bookings" / "Back to home".
15. **My bookings** — Tabs (Upcoming / Completed / Cancelled); booking cards with status pills
    (Accepted → "Pay ₦X to confirm" CTA, Confirmed, Completed → "Leave a review"); bottom tab bar.
16. **Notifications** — List of notification rows (request accepted [tap → Payment], payment
    confirmed, leave a review, session reminder); unread dots; bottom tab bar.
17. **Profile** — Avatar + name + role pill; 3 stat tiles; menu list (My bookings, Payment methods,
    Notifications, Settings); "Switch to coach view" banner; bottom tab bar.
18. **Settings** — Grouped lists: Account (edit profile, email & password, location), Preferences
    (push / email / reminder toggles), Support (Help & FAQ, Privacy & terms); "Log out".

### C. Coach
19. **Dashboard** — Greeting + avatar; 4 stat cards (New requests, Sessions this week, Earned this
    month, Rating); "Pending requests" preview list; coach bottom tab bar
    (Home / Requests / Calendar / Earnings / Profile).
20. **Incoming requests** — Tabs (New / Accepted / Declined); request cards with athlete, sport,
    date/time, price, note (tap → Request details).
21. **Request details** — Athlete header; **child banner if a parent booked**; details table
    (date/time/venue/fee); note from athlete; footer "Decline" / "Accept & request payment".
22. **Availability** — Per-day rows with on/off toggles and time ranges; editable time-slot chips
    for the selected day; "Save availability".
23. **Profile management** — Photo + "Change photo"; editable fields (name, sport selector, venue,
    price-per-session with recommended-range hint, about); "Save profile".
24. **Earnings** — Available-to-withdraw card + "Withdraw to bank"; 3 stat tiles; transactions list
    (credits + a payout row); coach bottom tab bar.

## Interactions & Behavior
- **Primary flow (athlete):** Splash → Welcome → Sign up → OTP → Role select → Home → (Search/Listing)
  → Coach details → Request session → Booking request → **Send request** → Success ("Request sent").
- **Accept + pay:** Coach accepts in Request details → athlete gets a notification → from Notifications
  or My bookings the athlete opens **Payment** → **Pay** → Success ("Booking confirmed").
- **Parent variant:** Role = parent surfaces child name/age fields on the Booking request screen and a
  "Booking for a child" banner on the coach's Request details screen.
- **Role switching:** Profile → "Switch to coach view" jumps to Coach Dashboard; coach Profile can
  switch back.
- **Navigation:** stack-based with a back stack; tab bars are persistent within each role area.
- **Transitions:** simple screen swaps in the prototype; in production use the platform's standard
  stack/tab navigation transitions.
- **Selected/active states:** filter chips, date cells, and time-slot chips have a selected state
  (accent or dark fill); bottom-tab active item is highlighted.

## State Management
State variables driving the prototype (recreate equivalently in the target app):
- `route` — current screen id (+ a `stack` array for back navigation).
- `role` — `athlete | parent | coach` (set at Role selection; affects Booking fields, Request-details
  banner, which tab bar + screens show).
- `coach` — index/id of the coach being viewed (drives Coach details, Booking, Payment, Success).
- `req` — index/id of the request being viewed (Coach → Request details).
- `paid` — boolean controlling the Success screen variant ("Request sent" vs "Booking confirmed").
- **Data sets** (mocked in the prototype, replace with real fetches): coaches list, my-bookings list,
  notifications list, incoming-requests list, earnings transactions.

## Design Tokens

### Color — "Clay" palette (current)
| Token | Hex | Usage |
|---|---|---|
| Canvas / page bg | `#F3E9DC` | screen background, bottom tab bar |
| Surface / card | `#FFFDF8` | cards, inputs, list rows |
| Ink (text + dark surfaces) | `#241C13` | headings, body text, avatars, splash, dark CTAs, pricing card |
| Accent | `#E1623C` | primary buttons, selected states, prices, active accents |
| On-accent text | `#FFFFFF` | text/icons on accent fills |
| Border | `#ECDFCD` | card/input borders |
| Border (alt, on canvas) | `#E2D2BD` | dividers on the canvas color |
| Subtle fill | `#F0E5D5` | muted chip backgrounds, icon placeholders |
| Muted text 1 | `#8a7b68` | secondary text |
| Muted text 2 | `#a08e76` | tertiary/labels |
| Muted text 3 | `#6e5f4d` | body-muted |
| Muted line/icon | `#c2b09a` | inactive icons, off-toggle |
| Photo gradient (dark) | `#2b2117` / `#352818` | image placeholder stripes |
| Success/confirmed pill | text `#2c6e2c` on `#e3f4e3` | "Confirmed" status |
| Destructive | `#c0392b` | "Log out" |

> These are the values to **redefine** when re-theming. Keep the *roles* (canvas / surface / ink /
> accent / on-accent / border / muted) and swap the hexes. The accent is the most brand-defining
> token. Note: a light accent needs dark on-accent text; a dark/saturated accent needs light
> on-accent text — keep that contrast relationship intact.

### Typography (current)
- **Display / headings:** `Schibsted Grotesk` (weights 700–900), tight letter-spacing (≈ −0.03em) on
  large headings.
- **Body / UI:** `Plus Jakarta Sans` (weights 400–700).
- Representative scale (px): screen title 26–37 / section heading 15–19 / body 13.5–14.5 / label 12.5 /
  meta 11–12. Status bar time 14.

### Radius
- Buttons/inputs `14–16`, cards `16–20`, avatars `14–22`, chips `11–12`, pills `999`.

### Spacing
- Screen horizontal padding `22px` (auth screens `26px`). Card padding `13–20px`. Inter-card gap
  `10–13px`. Sticky footer padding `14px 22px 22px`.

### Shadows
- Soft, low-elevation. The phone frame shadow is prototype chrome; for cards use subtle
  `0 1–2px` borders + very light shadow per the target platform.

## Assets
- **No bundled raster assets.** Photos are represented by **striped placeholders** labelled
  "athlete · hero photo" and "coach · action photo". Replace with real coach/sport photography.
- **Avatars** are initials on a colored tile (no image files).
- **Icons** are simple geometric shapes / emoji in the prototype — swap for the codebase's icon set.

## Files
- `CoachLink Clay.dc.html` — the full clickable prototype, all 24 screens (this is the design source
  of truth). Open it in a browser to click through; read the markup to extract exact styles/copy.
- `support.js` — the prototype runtime (reference only; **do not port**).

## Source Requirements (from the product PRD)
- Sports limited to **Tennis & Swimming**. Pricing is **per session** (₦), within sport-specific
  recommended ranges. Location is **venue-based in Amuwo Odofin** (e.g. Festival Hotel Pool, MU
  Court, Golden Tulip Pool, School Facilities). Payment via **Paystack**, **after** coach acceptance.
  **No in-app/WhatsApp chat** in the MVP.
