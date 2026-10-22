# CoachLink — Backlog

Known gaps and deferred work, so they live somewhere other than a chat log.
Ordered roughly by how much they cost if left alone.

---

## Repo layout

The project is two repositories, and nothing in this one says so.

- `Mbarachi/CoachLink` (this repo) — the Ionic app, plus a dead NestJS
  `backend/` (see PRD drift below).
- `Mbarachi/coachlink-firebase` — the live backend: the callable functions,
  Firestore rules and indexes, storage rules, the rules test suite, and the
  admin back-office at `public/admin.html`, served at `/admin` by a hosting
  rewrite.

Cloning this repo alone gives you a client with no visible server and no hint
that one exists. A paragraph in the README and the sibling path in `dev.sh` is
the whole fix.

Worth doing, because the absence has already produced one wrong conclusion: an
audit of this repo alone reported coach approval and the backend itself as
missing launch blockers, when both are built, committed and deployed one
directory over. The compromises below that name `firestore.indexes.json` and
`test/rules.mjs` refer to files in that second repo, not this one.

---

## Before go-live (30 October 2026)

**Deploy the backend again after 2026-10-22.** The 2026-10-20 deploy is done.
The 2026-10-22 changes (paid sessions cannot be cancelled; payouts that wait for
the balance and are retried every three hours; Paystack's transfer results) need
`npm run deploy` too. The retry job is the project's first scheduled function, so
the first deploy may ask to turn on Cloud Scheduler for the project; say yes.

**The support address receives mail.** The app and the server tell people to
write to `SUPPORT_EMAIL`, `coachlink@webhammer.com.ng` since 2026-10-22, set in the
app's `lib/support.ts` and the backend's `types.ts`. Worth sending it a test
message before launch to be sure someone reads it.

**Paystack set-up for paying coaches.** Business verified (done, 2026-10-22).
Still to do in the Paystack dashboard:
- Switch the payout schedule to Manual, so athletes' payments stay in the
  Paystack balance that coach payouts are sent from: Settings, Accounts, sign
  the consent form, "Request Single Payout Account", then ask Paystack support
  to switch the schedule. Preferences then shows Payout Schedule as "Settled to
  Balance". CoachLink's 8% stays in the balance and is withdrawn by hand.
- Untick "Confirm transfers before sending" under Preferences. Otherwise every
  transfer waits for a code nobody types; the server now records those as
  waiting rather than sent, but they still do not move.
- Make sure the webhook URL under Settings, API Keys & Webhooks points at the
  live `paystackWebhook` function. Transfer results arrive on the same URL as
  payments.

---

## Notifications: reminders and email still to build

Every event now notifies the right side, in the app and as a phone push
through OneSignal (the push is sent from the same record, by `pushNotification`).
Added 2026-10-22: request withdrawn, unpaid session cancelled, payment failed,
request expired (a half-hourly job, `notifyExpiredRequests`), and the review
prompt when a session is marked done. The coach no longer hears "You have been
paid" when the athlete pays; that is "Sessions paid for".

Reminders, built 2026-10-22 (`sendReminders`, every 15 minutes; the timing
rules are `planReminders` in `reminders.ts`, tested by `npm run test:reminders`):
- **Coach, request still unanswered** an hour after it arrived.
- **Athlete or parent, accepted but unpaid**, from 24 hours before the first
  session (not within an hour of acceptance), once per request.
- **Both, session coming up**: the evening before, 7pm to 10pm Lagos time (one
  message per coach for the whole day), and 2 hours before.
- **Coach, session over but not marked done**, 3 hours after it ends. Pairs with
  the auto-complete decision below.

Not built: **email** for the two moments a missed push costs most, a new
request to a coach and "accepted, please pay" to an athlete. Resend is already
set up for the confirmation codes; Paystack already emails athletes a receipt.

Push only reaches someone with the installed app, signed in, who allowed
notifications; the web version gets the in-app list only.

---

## Session lifecycle: open decisions

Reviewed 2026-10-20. How a session ends is the least-designed part of the
booking flow, and three decisions are waiting on the owner.

**How it works today.** Only the coach can end a session, by marking it
complete, and only once its start time has passed (`updateBooking`). That one
tap pays the coach (`payoutOnCompletion`) and lets the athlete review. Nothing
ends a session on its own: there is no scheduled function, and the athlete or
parent has no say at all. What follows from that:

- **A coach who forgets is never paid**, and the athlete is never asked for a
  review. The session stays "awaiting confirmation" forever.
- **A no-show cannot be reported.** The athlete has no way to say the coach did
  not turn up, and a coach can mark complete a session that never happened —
  see the payout item under Shipped outside PRD scope.
- **Cancelling a paid session: decided 2026-10-22.** A paid session cannot be
  cancelled, by either side; the server refuses it, and the payment screen
  says so kindly before anyone pays. Anything that truly cannot go ahead is
  handled by hand through support. There is still no refund step anywhere
  (`REFUNDED` exists as a payment status and nothing sets it).
- **Paying after a session's date: fixed 2026-10-22.** `initializePayment`
  charges only unpaid sessions that have not started, records which on the
  payment (`bookingIds`), and settling confirms only those. With nothing ahead
  it refuses. The app shows an unpaid session as "Not paid" from its start.

The app now hides Pay and Cancel once a session's hour is over (commit
`888cb73`), but that is display only; the server still accepts both.

**Proposed rules.**
- A session ends an hour after it starts; sessions are fixed at an hour.
- After that, both sides are asked. The coach as now; the athlete or parent
  gets "Did your session with Tobi happen?" — Yes, or There was a problem.
  Either Yes completes it. A problem holds the payout and goes to admin.
- Nobody answers within 48 hours: it completes on its own, so the coach is paid
  and the athlete asked for a review. Needs the project's first scheduled
  function.
- No cancelling after the start time; reporting a problem replaces it.
- ~~An unpaid session whose time passes can no longer be paid.~~ Done
  2026-10-22, from its start time.

**Decisions needed.**
1. The auto-complete window — 48 hours? — and whether it applies at all.
2. ~~Refunds on cancelling a paid session.~~ Decided: paid sessions cannot be
   cancelled (above). Revisit only if support starts handling many by hand.
3. Who settles a reported problem, and what they can award: full refund,
   partial, or pay the coach anyway.

---

## Not built

**Prepaid packages as a leakage defence** — packages exist as a booking shape,
but nothing about them is priced or marketed as "pay for five, stay for five".
See Open risks.

---

## Deferred

**Verification email presentation** — Firebase sends from
`noreply@coachlink-22ee0.firebaseapp.com`, which reads as spam and is a strong
filtering signal. Three levels, increasing effort: customise the template in
the Firebase console; verify a custom sending domain, which removes the main
trigger; or generate the link server-side and send through Resend, which the
Nest backend already did.

**Coach-side notifications — deliberately out.** The PRD puts the notifications
screen under athlete/parent screens only, and a coach's equivalents are better
placed already: the dashboard's pending-requests count, the incoming-requests
list, and the verification banner for an approval or rejection. Writing coach
rows with no screen to read them would be invisible data. Revisit with push,
where the tray is the surface and no screen is needed.

**Coach dashboard carousel — decided against.** The athlete home has a
rotating hero; the coach dashboard does not, and should not. Athlete home is a
discovery surface and both slides push into search. The coach dashboard is a
work surface — a coach opens it to accept requests and check the week — so a
rotating banner would sit directly above the pending-requests list and compete
with the one thing that matters. Revisit only with a single static card that
earns the space: a **Next session** card (`Wed 8:00 AM · Festival Hotel Pool`)
is the obvious candidate, since "Sessions this week: 7" gives a count but never
says when to leave the house.

**Coach cover image — decided against.** The detail page hero is a per-sport
illustration (`SportBanner`), not an upload. Asking a coach for a third image
was judged unnecessary: it adds a step to a flow that already carries two
compulsory uploads and an unresolved drop-off problem, and the sport scene
gives the page somewhere to breathe without it. Revisit only if coaches start
asking to show their own venue.

**Training venue is free text — map or list?** A coach types any venue they
like in the wizard, and nothing checks it is a real place. Two costs: an athlete
can be sent somewhere that does not exist or is spelt so it cannot be found, and
the search filter chips are built straight from what coaches typed
(`venuesOf`), so "Festival Hotel Pool" and "festival hotel pool" become two
chips. Options, increasing effort:
- **A fixed list of known venues** the coach picks from, with "Other" sending a
  new name to admin to add. Cheapest, fits a single area like Amuwo Odofin, and
  fixes the duplicate chips outright.
- **Admin checks the venue during coach approval**, as it already checks the ID.
  No new code beyond a line on the review screen, but a typo still goes live.
- **Map-based**: Google Places autocomplete, storing a place ID and
  coordinates. Proves the place exists, enables "near me" and directions, but
  adds an API key, billing and a map screen to a wizard with a drop-off problem.

The fixed list is the likely first step; maps only earn their cost once the
app spreads past a few neighbourhoods.

**Find a coach: ideas not taken (2026-10-20).** Option 1b shipped. Left over:
- **Three quick questions on first visit** (design option 1a): sport, who is
  training, level, then the list. Gentlest for a first-time parent; after the
  first time the tab opens straight to the list. Suggested alongside 1b, not
  chosen.
- **The tab is still labelled "Search"** while the screen says "Find a coach".
- **Coaches who have not answered the two new questions show under every
  filter**, so the filters are loose until most have answered. Once they have,
  sort the unanswered ones last, or hide them under a filter.

**"Next open" is a coach's weekly times, not real free slots.** Bookings are
readable only by their two parties, so the card cannot know a slot is taken,
and it says "Next open" rather than "Next free" for that reason. Honest free
times need a public busy-slots read or a callable returning them.

**Coach dashboard "Upcoming sessions" counts too much.** It counts future
sessions on accepted requests, which includes ones not yet paid and ones since
cancelled. Counting future UPCOMING bookings instead would match the athlete's
number.

---

**Reviews cannot be tested without a past session.** Completion requires the
session date to have passed and every seeded booking is dated ahead, so trying
the review flow means seeding a paid booking in the past or waiting for one to
age into it. The same gap blocks testing payouts end to end.

**The seed script makes no sample data.** `npm run seed` creates the two sports
and the admin, nothing else. Checking Find a coach, the review row and the
booking tabs on 2026-10-20 took throwaway scripts writing coaches, a parent,
reviews and past and future bookings straight into the emulator. A `seed:demo`
that does the same would make every screen testable in a minute.

**Local emulator mode does not work in a browser.** Two separate faults:
- The app connects to the emulators at `127.0.0.1` (`HOST` in
  `src/lib/firebase.ts`), but the Content-Security-Policy in `index.html`
  allows only `http://localhost:*`, so every call is blocked. Change `HOST` to
  `localhost`, or add `http://127.0.0.1:*` to `connect-src`.
- On Victor's Mac the Datadog agent holds ports 5001 and 5002, and 5001 is the
  Functions emulator's port, so `./dev.sh --emulate` cannot start functions.
  Move it in `firebase.json`, the `connectFunctionsEmulator` call and
  `test/run.mjs` (5011 was free), or stop the agent while developing.

**`npm run lint` cannot run.** ESLint is not installed in `mobile/` and there is
no `eslint.config.js`, so the script fails before checking anything. Type
checking (`tsc -b`) is the only automated check on the app today.

## Known compromises

**Find a coach filters on the phone.** Since 2026-10-20 the app reads every
approved coach in one query (up to `DISCOVERY_LIMIT`, 300) and filters and
sorts them itself, because six filters in Firestore would need a composite index
per combination. Fine for one neighbourhood; revisit once listings run into the
hundreds, when that read gets slow and a search service (Algolia, Typesense)
starts to pay for itself. A side effect: name search is now a plain "contains"
on the phone, so "dinma" finds "Chidinma", and the backend's `searchTokens`
prefix field is no longer read by the app. It can go, with its index.

**"See all" reviews stops at 50.** `listForCoach` returns a coach's 50 newest.
The count shown is the coach's real total, so it stays right, but reviews past
50 cannot be read. Add paging before any coach gets near it.

**Firestore indexes must mirror every query shape.** A missing composite index
is a runtime failure, not a slow query, and the emulator does not catch it
because it creates them on demand. Any new query needs checking against
`firestore.indexes.json` and, ideally, a line in `test/rules.mjs`.

**No spending cap.** Firebase offers budget alerts, not limits. The coach list
is publicly readable, so a scraper or a runaway client listener bills you.

**One project serves dev and prod.** `coachlink-22ee0` is both. A second
project would make "let us wipe it and start again" a safe thing to say.

**Coach photos uploaded before September 2026 are still full-size.** New ones
are capped at an 800px long edge on the phone before upload, but the ones
already in Storage were not, and a list tile is 62x62. Either re-upload them or
write a Storage-triggered function that makes a small variant for the list.

**The iOS deployment target is set by hand, outside git.** OneSignal's pod
needs iOS 15, and `npx cap add ios` generates a project targeting 14, so
`cap sync` fails on a fresh checkout with "required a higher minimum deployment
target". `ios/` and `android/` are gitignored, so the fix does not travel: in
`ios/App/Podfile` set `platform :ios, '15.0'`, and in
`ios/App/App.xcodeproj/project.pbxproj` replace every
`IPHONEOS_DEPLOYMENT_TARGET = 14.0` with `15.0` (four of them). Costs no real
coverage — every device that runs iOS 14 can run 15. Worth a line in the mobile
README, or committing the native projects.

**Selected chips are weak in dark mode.** In light a selected chip is
near-black against white — unmissable. In dark both it and its neighbours are
dark fills, separated mainly by accent text and a border. Legible, and normal
for dark UI, but a step down. The knob is dark `--cl-ink-fill` (`#3A2E20`),
which is also the emphasis card, so the two move together; decoupling them
costs a second token.

**The reset password flow leaves the app.** Reviewed 2026-09-25 and parked. The
new password is typed on a Firebase-branded web page, `/auth/reset-success` is
routed but unreachable, and `/auth/forgot-password/otp` is named for a code the
flow does not use. A fully in-app six-digit flow — which is what the PRD and
mockups specify — needs an email provider and verified sending DNS, because
there is no mail transport in the backend at all: Firebase Auth sends every
email the product currently sends.

---

## PRD drift

Closed, apart from the note below. The PRD's Technical Stack section now records what was actually
built and why it differs, and `backend/` has been deleted — a dead NestJS
service left in the tree would have cost whoever joins next a day of reading
the wrong thing.

The PRD still lists an OTP screen and the mockups show a six-digit code; the
built flow is an emailed link (`CheckInboxPage`, titled "Check your inbox").
The reset flow is the same story — see Known compromises.

---

## Shipped outside PRD scope

Recorded so the PRD screen inventory is not mistaken for the whole build.

- **Dark mode** (2026-09-22). System / Light / Dark, chosen in Settings, with a
  warm dark palette. Not in the PRD at any version.
- **Push notifications** (OneSignal), an athlete profile editor, and resuming
  the coach wizard (text is kept on the phone; the photo and ID are not, so they
  are picked again).
- **Coach resubmit screen.** The PRD has no rejected-coach path at all; the
  flow exists so a rejection is answerable rather than terminal.
- **Hero carousel gutter** on athlete home, and the per-sport coach hero noted
  under Deferred above.

---

**How a payout moves (since 2026-10-22).** Marking a session complete starts a
transfer from the Paystack balance. If the balance is short — normal with
"Settled to Balance", since an athlete's payment arrives the next working day —
the payout stays "Sending" and `retryPayouts` tries again every three hours.
Paystack's `transfer.success`, `transfer.failed` and `transfer.reversed` webhooks
then mark it sent or failed. Coaches only ever see plain wording; Paystack's own
message is kept in the payout's `lastError` for us. See Before go-live for the
dashboard settings this depends on.

**A payout is sent as soon as a session is marked complete**, and the coach is
the one who marks it. There is no hold period and no dispute window, so a
session marked complete that did not happen is money already gone. Fine at this
size, where every coach is known; a 24-hour hold is the first thing to add if it
is ever abused.

---

## Open risks

**Disintermediation.** The first session gets booked here; the second gets
arranged by phone. Coaching sits in the worst quadrant for this — high ticket,
high repeat, a single named provider, met in person, nothing to ship — and the
local default is a WhatsApp thread and a transfer. Price around it rather than
try to seal it.

The take rate is now set at **8%**, a decision made in September 2026 and held
in one place — `COMMISSION_RATE` in the backend's `types.ts`. The PRD sets
session pricing and says nothing about what CoachLink keeps, so the PRD is what
is out of date here, not the code.

Sequenced, and the first two matter most:

- **Payouts come first.** Shipped: a completed session pays the coach
  automatically. A coach who cannot be paid reliably will push for cash on
  their own, so this was the single largest driver of leakage.
- **The rate sits below the annoyance threshold.** At 20% of a ₦15,000 session
  a coach saves ₦3,000 by calling, which is worth the call. At 8% they save
  ₦1,200 and the friction of arranging it wins.
- **Prepaid packages**, 5 or 10 sessions. Money already taken beats any policy:
  the athlete has paid, the coach has booked income, and leaving mid-pack costs
  them both. The strongest thing we can build here, and a better product even
  if leakage were not a concern.
- **Commission that falls with a coach's on-platform volume**, so the incentive
  to leave shrinks exactly when it would otherwise peak. A carrot, not a clause.
- **Count repeat bookings per coach–athlete pair now**, while it is one field on
  a document. Without it there is no way to tell leakage from ordinary churn
  later, and the number decides everything above.

Not worth building: contact masking. They meet in person on day one and the
market runs on WhatsApp. Anti-circumvention terms are similarly unenforceable
against informal coaches and should not be load-bearing.

Two things that soften the whole problem. Parents leak least — what a parent
buys is accountability for a child, which does not survive the move to a
private arrangement, so they are the segment worth acquiring hardest. And if
leakage turns out to be near-total, the fallback is to stop charging per
transaction and charge coaches for access to new athletes: a lead product
rather than a marketplace, where a coach leaving with a client is the product
working rather than failing.
