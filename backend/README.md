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

- OTPs (signup verification, password reset) have no email/SMS provider wired
  up yet — codes are printed to the server console instead.
- `JWT_SECRET` in `.env` is a dev-only placeholder — replace it before any
  real deployment.
