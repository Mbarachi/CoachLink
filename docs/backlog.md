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

## Not built

**Prepaid packages as a leakage defence** — packages exist as a booking shape,
but nothing about them is priced or marketed as "pay for five, stay for five".
See Open risks.

---

## Deferred

**Resuming incomplete onboarding** — nice to have. If someone quits the coach
wizard midway, progress is lost. Worse than the lost typing: they are already
authenticated, so the next launch drops them into the app with no coach
profile and no prompt to finish. Needs step state persisted and a route back
into the wizard.

**Verification email presentation** — Firebase sends from
`noreply@coachlink-22ee0.firebaseapp.com`, which reads as spam and is a strong
filtering signal. Three levels, increasing effort: customise the template in
the Firebase console; verify a custom sending domain, which removes the main
trigger; or generate the link server-side and send through Resend, which the
Nest backend already did.

**Push notifications** — V2 per the PRD's own roadmap, which settles the
question the earlier entry here left open: MVP is the in-app list, and that is
built. The design is already one signal for both channels. `notify()` writes a
row to `notifications`; the in-app list queries it, and push would be a second
consumer — an `onDocumentCreated` trigger reading the same row and sending to
FCM. The row already carries `title`, `message` and `link` because those are
exactly a push payload. Adding push therefore touches one new file and changes
no event source. The real remaining cost is device tokens on the user document,
the permission prompt, and APNs/FCM certificates.

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

---

**Reviews cannot be tested without a past session.** Completion requires the
session date to have passed and every seeded booking is dated ahead, so trying
the review flow means seeding a paid booking in the past or waiting for one to
age into it. The same gap blocks testing payouts end to end.

## Known compromises

**Coach search is prefix-only.** Firestore has no case-insensitive contains, so
`searchTokens` indexes every prefix of every name word. "dinma" will not find
"Chidinma". Real search needs Algolia or Typesense.

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

The crop is centre-biased too. `object-fit: cover` on a 3:4 portrait in a
square tile keeps the middle and discards the top, but on portrait photos the
head sits in the upper third — so faces land low and the room fills the frame.
`object-position: 50% 30%` fixes it across the board at no cost.


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

**Settings toggles are decoration.** Push notifications, Email updates and
Booking reminders are `useState` in the page — they flip, and nothing reads
them. The push one is the problem: someone who turns it off still gets pushed,
which is a promise broken rather than a feature missing. Either wire it to
OneSignal's subscription state or take the row out.

**Twelve settings rows do nothing.** Edit profile (athlete), Email & password,
Location, Payout account, Help & FAQ and Privacy & terms, across both roles.
Payout account is the odd one: the form exists, on the Earnings screen, so that
row only needs pointing at it.

---

## PRD drift

Mostly closed. The PRD's Technical Stack section now records what was actually
built and why it differs, and `backend/` has been deleted — a dead NestJS
service left in the tree would have cost whoever joins next a day of reading
the wrong thing.

One left:

- **OTP verification.** The PRD lists an "OTP Verification" screen and the
  design mockups show a six-digit code. Built as an email verification link
  instead — `/auth/otp` renders `CheckInboxPage`, and nothing sends a code.
  Worth deciding whether the mockups change or the flow does, since the screen
  a user meets is still titled as though a code is coming.

---

## Shipped outside PRD scope

Recorded so the PRD screen inventory is not mistaken for the whole build.

- **Dark mode** (2026-09-22). System / Light / Dark, chosen in Settings, with a
  warm dark palette. Not in the PRD at any version.
- **Coach resubmit screen.** The PRD has no rejected-coach path at all; the
  flow exists so a rejection is answerable rather than terminal.
- **Hero carousel gutter** on athlete home, and the per-sport coach hero noted
  under Deferred above.

---

**Paystack has to approve the business for transfers.** Payments in work on a
plain live account; paying money *out* does not. Until transfers are enabled
every payout will fail and sit at FAILED with Paystack's reason attached — the
earnings are still recorded correctly, they simply do not move. Worth confirming
before the first real coach completes a session, not after.

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
