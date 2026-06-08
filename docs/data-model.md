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
* hourlyRate
* state
* area
* verificationStatus
* rating
* totalReviews
* isActive

Verification Status:

* PENDING
* APPROVED
* REJECTED

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
* athleteId
* coachId
* sportId
* proposedDate
* proposedTime
* notes
* status

Status:

* PENDING
* ACCEPTED
* DECLINED
* EXPIRED

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