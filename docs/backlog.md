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
