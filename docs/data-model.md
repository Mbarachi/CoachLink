# CoachLink Data Model

## User

Fields:

* id
* firstName
* lastName
* email
* phoneNumber
* role
* profileImage
* isVerified
* createdAt
* updatedAt

Roles:

* ATHLETE
* PARENT
* COACH
* ADMIN

---

## CoachProfile

Fields:

* id
* userId
* bio
* yearsOfExperience
* sessionRate
* venue
* verificationStatus
* verificationNote — why an admin approved or rejected; shown to the coach
* previousRejectionNote — what the coach was told on the attempt before this one
* submissionCount — 1 on the first submission, incremented on each resubmission
* resubmittedAt
* reviewedAt
* reviewedById
* rating
* totalReviews
* isActive

Verification Status:

* PENDING
* APPROVED
* REJECTED

Rules:

A rejection is not the end of the line, and it is not reversed by an admin
changing their mind. REJECTED returns to PENDING only when the coach supplies a
replacement ID document or profile photo — at least one must actually differ
from the pair that was turned down, so asking again with the same evidence is
refused. An admin may never set PENDING directly.

The documents are otherwise write-once: the ordinary profile update cannot
touch profileImage or idDocumentPath, so identity evidence changes only through
a resubmission that goes back for review.

---

## Sport

Fields:

* id
* name
* icon
* isActive

Initial Records:

* Tennis
* Swimming

---

## CoachSport

Fields:

* coachId
* sportId

---

## BookingRequest

Fields:

* id
* athleteId — the account that booked (an ATHLETE for themselves, a PARENT for a child)
* coachId
* sportId
* mode — SINGLE or PACKAGE
* weeks — package only, how many weeks the recurrence runs
* daysOfWeek — package only, 0 = Sunday
* startTime — coach-local "HH:mm"
* sessionRate — snapshotted at request time
* sessionCount
* totalAmount — sessionRate x sessionCount
* notes
* childName — parent bookings only
* childAge — parent bookings only
* status
* respondedAt

Status:

* PENDING
* ACCEPTED
* DECLINED
* EXPIRED
* CANCELLED

Rules:

A package is one request the coach accepts or declines as a whole. The
recurrence is expanded into concrete BookingRequestSession rows at request
time, so the coach sees the exact dates before committing and conflicts are
detectable. A request is capped at 24 sessions.

sessionRate is copied from the coach at request time. A coach who later
raises their rate must not change what an already-submitted request costs.

EXPIRED is derived, never stored: a PENDING request whose first session has
passed reads as expired and can no longer be accepted. This avoids a
scheduler for the MVP.

CANCELLED is set by the athlete withdrawing a pending request. A coach
declines rather than cancels.

---

## BookingRequestSession

Fields:

* id
* requestId
* scheduledAt — full UTC datetime

One concrete session belonging to a request. Times are stored in UTC;
coach-local means Africa/Lagos, which is UTC+1 year-round with no DST.

---

## Booking

Fields:

* id
* bookingRequestId
* athleteId
* coachId
* sportId
* sessionDate
* status

Status:

* UPCOMING
* COMPLETED
* CANCELLED

---

## Payment

Fields:

* id
* bookingId
* amount
* currency
* provider
* transactionReference
* status

Provider:

* PAYSTACK

Status:

* PENDING
* SUCCESS
* FAILED
* REFUNDED

---

## Review

Fields:

* id
* athleteId
* coachId
* bookingId
* rating
* comment
* createdAt

Rule:

Only completed bookings can create reviews.

---

## Notification

Fields:

* id
* userId
* title
* message
* type
* isRead
* createdAt