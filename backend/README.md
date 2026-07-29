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
npm run start:dev           # starts the API on :3000
```

## Phase status

Only `auth` and `users` are implemented so far (signup/signin/OTP verification/
password reset, `GET|PATCH /users/me`). Coaches, Sports, Booking Requests,
Bookings, Payments, Reviews, and Notifications are later phases — see
`../docs/api-spec.md` and `../docs/data-model.md` for the full intended shape,
and `mobile/src/services/*.ts` / `mobile/src/types/*.ts` for the exact
contract the frontend expects each module to satisfy.

## Dev notes

- OTP emails send via [Resend](https://resend.com) (`src/mail/mail.service.ts`).
  Set `RESEND_API_KEY` in `.env` to send real emails; leave it blank and codes
  just print to the server console instead (dev fallback, always logged either
  way). Until a custom sending domain is verified in Resend, the sandbox sender
  (`onboarding@resend.dev`) can only deliver to the email on your Resend account.
- SMS OTP delivery isn't wired up — email only for now.
- `JWT_SECRET` in `.env` is a dev-only placeholder — replace it before any
  real deployment.
