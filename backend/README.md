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
(list/detail/create/update), `booking-requests` (create/list/detail/respond)
and `admin` (coach verification). Bookings, Payments, Reviews and
Notifications are later phases — see `../docs/api-spec.md` and
`../docs/data-model.md` for the full intended shape, and
`mobile/src/services/*.ts` / `mobile/src/types/*.ts` for the exact contract
the frontend expects each module to satisfy.

## Coach verification

A new coach profile starts `PENDING` and stays invisible to athletes — both
`GET /coaches` and `GET /coaches/:id` return only approved, active profiles.

Approve one through the back office at **http://localhost:3000/admin**. It is
a single page served by the API itself: no separate app, no build step. Sign
in with an admin account, review the pending queue, approve or reject. A
rejection requires a note, which is stored on the profile along with who
decided and when.

Create that admin account by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in
`.env` and running `npm run seed` — it creates the user or promotes an
existing one. There is deliberately no way to sign up as an admin.

ID-document upload and storage are still to be built; verification today is
whatever the reviewer can tell from the profile itself.

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
