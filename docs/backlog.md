# CoachLink — Backlog

Known gaps and deferred work, so they live somewhere other than a chat log.
Ordered roughly by how much they cost if left alone.

---

## Not built

**Reviews** — blocked until a booking can reach COMPLETED. Completion requires
the session date to have passed, and every booking is currently dated ahead, so
a past paid session has to be seeded before this is even testable.

**Notifications** — open question of in-app list only versus real push. Push
means FCM, device tokens and permission prompts, which is substantially more
work than the list.

**Coach bookings screen** — a hole in a shipped flow rather than a missing
feature. The service already returns a coach's sessions correctly and no page
consumes it, so a coach can accept work, be paid, and have no way to see their
own schedule.

**Coach availability** — athletes propose free-form times. There is no
availability model, so a coach can be sent a request for a slot they were never
free for.

**Earnings / payouts** — payments land with Paystack; nothing moves money on to
coaches. A bigger question than payments was.

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

**Coach cover image.** A second, optional image separate from the headshot,
shown as a hero on the coach's detail page. Worth doing as the *venue* rather
than a portrait — the pool or court where sessions actually happen — because
that answers a question an athlete genuinely has, and a parent deciding where
to send a child has it twice as hard. As decoration it is not worth the upload.

Two constraints on where it goes. It does not belong on the coaches list card:
that list is for scanning and comparing, a banner per row cuts how many coaches
fit on a screen, and the image does not help anyone choose. And it does not
belong in onboarding, which already carries two compulsory uploads and an
unresolved drop-off problem — this is an optional upload from
`ProfileManagementPage`, added after approval.

Needs a fallback, as every user-supplied image here does. Sport-derived is the
right one — a court for tennis, a pool for swimming — so a coach with no cover
still reads as the right kind of coach. `EmptyIllustration` has no sport art
yet, so that is two new illustrations.


---

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

**Coach photos are served full-size.** A coaches-list tile is 62x62 and the
stored file is up to 1200x1600, so every row downloads roughly a hundred times
the image data it paints, per coach, on a list. On a Lagos mobile connection
that is a visible stall. `FilePicker` already caps captures at 1200px, so the
fix is not a tighter cap but a derivative: a Storage-triggered function writing
a small square variant that the list reads, falling back to the original.

The crop is centre-biased too. `object-fit: cover` on a 3:4 portrait in a
square tile keeps the middle and discards the top, but on portrait photos the
head sits in the upper third — so faces land low and the room fills the frame.
`object-position: 50% 30%` fixes it across the board at no cost.


---

## Open risks

**Disintermediation.** The first session gets booked here; the second gets
arranged by phone. Coaching sits in the worst quadrant for this — high ticket,
high repeat, a single named provider, met in person, nothing to ship — and the
local default is a WhatsApp thread and a transfer. Price around it rather than
try to seal it.

Worth noting the take rate is not decided anywhere yet. The PRD sets session
pricing and says nothing about what CoachLink keeps, so this is still an open
choice rather than something to defend.

Sequenced, and the first two matter most:

- **Payouts come first**, and they are already listed above under Not built. A
  coach who cannot be paid reliably will push for cash on their own — so the
  single largest driver of leakage right now is a feature we have not shipped.
- **Keep the rate below the annoyance threshold.** At 20% of a ₦15,000 session
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
