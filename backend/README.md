# CoachLink Backend

NestJS + PostgreSQL (Prisma) API for the CoachLink mobile app. Serves at
`http://localhost:3000/api/v1` by default, matching `mobile/.env.example`'s
`VITE_API_BASE_URL` — the mobile app needs no config changes to talk to this
locally.

## Setup

```bash
cp .env.example .env        # defaults already work for local dev
docker compose up -d        # starts Postgres
npx prisma migrate dev      # creates the schema
npm run seed                # inserts the two MVP sports
npm run start:dev           # starts the API on :3000
```

## Phase status

Implemented: `auth` (signup/signin/OTP verification/password reset),
`users` (`GET|PATCH /users/me`), `sports` (`GET /sports`), `coaches`
(list/detail/create/update) and `booking-requests` (create/list/detail/
respond). Bookings, Payments, Reviews and Notifications are later phases — see `../docs/api-spec.md` and
`../docs/data-model.md` for the full intended shape, and
`mobile/src/services/*.ts` / `mobile/src/types/*.ts` for the exact contract
the frontend expects each module to satisfy.

## Coach verification

`GET /coaches` only returns profiles with `verificationStatus: APPROVED`, so a
newly created profile is invisible to athletes until it is approved. There is
no approval UI yet — flip it manually while developing:

```sql
UPDATE "CoachProfile" SET "verificationStatus" = 'APPROVED' WHERE id = '<id>';
```

The admin approval workflow and ID-document storage are still to be built.

## Dev notes

- OTP emails send via [Resend](https://resend.com) (`src/mail/mail.service.ts`).
  Set `RESEND_API_KEY` in `.env` to send real emails; leave it blank and codes
  just print to the server console instead (dev fallback, always logged either
  way). Until a custom sending domain is verified in Resend, the sandbox sender
  (`onboarding@resend.dev`) can only deliver to the email on your Resend account.
- SMS OTP delivery isn't wired up — email only for now.
- `JWT_SECRET` in `.env` is a dev-only placeholder — replace it before any
  real deployment.

## Booking requests

A request is one unit the coach accepts or declines as a whole, whether it is
a single session or a package. Packages are expanded into concrete session
rows when the request is created, capped at 24 sessions.

Accepting only flips the status — it does not yet create Bookings, since the
Bookings module does not exist. `EXPIRED` is derived on read rather than
stored, so no scheduler is needed: a pending request whose first session has
passed reads as expired and can no longer be accepted.

Times are stored in UTC. Coach-local means Africa/Lagos (UTC+1, no DST).
