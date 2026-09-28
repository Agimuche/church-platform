# Church Media & Digital Services Platform

A web platform for a church to run live streaming, a sermon/media archive, a
digital store, prayer requests, pastoral counseling, announcements, and a
gallery — for visitors, members, media staff, pastors, and administrators.

This is an MVP. It implements Phase 1 (foundation) and the highest-priority
parts of Phase 2 (public media browsing) in full, with working end-to-end
flows for live streaming control, checkout/payments, and prayer/counseling
requests. See **"What's implemented vs. stubbed"** below for the honest
breakdown.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4**
- **PostgreSQL** + **Prisma ORM**
- **NextAuth v5** (Credentials provider, JWT sessions) + **bcrypt**
- **Zod** for validation
- Custom **RBAC** layer (not a library) — see `src/lib/rbac/`

No unnecessary dependencies were added. Payment/streaming/storage vendors are
each behind a small interface so a real provider can be swapped in without
touching the frontend or database.

## Requirements

- Node.js 20+
- A PostgreSQL database (local, Docker, or hosted — e.g. Supabase, Neon, RDS)

## Installation

```bash
git clone <this-repo>
cd church-platform
npm install
cp .env.example .env
```

Edit `.env` — at minimum set `DATABASE_URL` and `AUTH_SECRET`
(`npx auth secret` will generate one for you).

## Database Setup

```bash
npm run db:migrate   # creates tables from prisma/schema.prisma
npm run db:seed       # creates a Super Admin account + sample content
```

The seed script prints the Super Admin's email/password (defaults to
`admin@church.local` / `ChangeMe123!` unless you set
`SEED_SUPER_ADMIN_EMAIL` / `SEED_SUPER_ADMIN_PASSWORD` in `.env`). **Change
that password after your first login.**

## Development

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign in at `/login` with the seeded Super
Admin account to reach `/admin`.

## Admin Setup

The seed script is the intended way to create your first account — there is
intentionally no public way to self-register as anything above `MEMBER`.
Once signed in as Super Admin, promote other staff by updating their `role`
directly in the database (`prisma studio` is the easiest way: `npm run
db:studio`) until a dedicated "manage roles" admin form is built.

## Provider Configuration

Three vendor integrations are behind clean interfaces. Each defaults to a
mock/local implementation so the app runs with **zero paid credentials**.

| Concern   | Env var             | Default (`mock`/`local`)         | Real option                          |
|-----------|----------------------|-----------------------------------|---------------------------------------|
| Streaming | `STREAMING_PROVIDER` | In-memory, no network calls       | Implement `StreamingProvider` (e.g. Mux, Cloudflare Stream) in `src/lib/providers/streaming/` |
| Payments  | `PAYMENT_PROVIDER`   | Always succeeds                   | `paystack` — set `PAYSTACK_SECRET_KEY` |
| Storage   | `STORAGE_PROVIDER`   | Writes to `.local-storage/` on disk | `s3` — install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`, set the `AWS_*`/`S3_*` vars (see `src/lib/providers/storage/s3-provider.ts`) |

Switching providers is a one-line env change plus (for a new vendor) one new
file implementing the interface in `src/lib/providers/<concern>/types.ts` —
nothing in the frontend or Prisma schema needs to change.

### Paystack

1. Get your secret key from the Paystack dashboard.
2. Set `PAYMENT_PROVIDER=paystack` and `PAYSTACK_SECRET_KEY=sk_...` in `.env`.
3. Point a Paystack webhook at `https://<your-domain>/api/webhooks/paystack`.
   The handler verifies the webhook's HMAC signature and then re-verifies
   the transaction server-side before marking an order paid — see
   `src/app/api/webhooks/paystack/route.ts`.

## Testing

No automated test suite is included in this MVP pass. Before adding
features, prioritize tests for: authentication, authorization/RBAC, payment
verification, prayer-request privacy, counseling-request privacy, media
visibility (public vs. members-only), stream start/stop permissions, and
order creation — per the project brief.

## Deployment

Not yet configured. At minimum you'll need: a managed Postgres instance, an
`AUTH_SECRET` and `NEXTAUTH_URL` matching your production domain, a real
`STORAGE_PROVIDER` (S3), and — if you enable checkout — a real
`PAYMENT_PROVIDER`.

## What's Implemented vs. Stubbed

**Implemented and working end-to-end** (assuming a real Postgres database —
see the note below):
- Auth: registration, credentials login, JWT sessions carrying role, RBAC
  guards on server routes, middleware protecting `/admin` and `/account`
- Public site: home, sermon archive with search/filter/sort/pagination,
  sermon detail (members-only gating, paid badge), audio/video listing,
  live page, store listing + detail, gallery listing, events, prayer and
  counseling submission forms, about/contact placeholders
- Live streaming: `StreamingProvider` abstraction + mock implementation;
  admin can schedule, start, and stop a stream, which calls the provider
  and updates the database
- Commerce: checkout creates a server-priced `Order`, initializes payment
  through `PaymentProvider`, and a Paystack webhook verifies + settles it
- Prayer & counseling: submission (member or guest), admin list + status
  updates, private/public visibility on prayer requests
- Admin dashboard: live metrics (members, media, orders, revenue, open
  requests) plus list pages for users, media, products, orders,
  announcements, prayer requests, and counseling requests
- Provider abstractions for streaming, payments, and storage, each with a
  working default implementation

**Stubbed / left for the next phase** (architected for, not built):
- Media/product **upload UI** (the `StorageProvider` and `Media`/`Product`
  models are ready; there's no admin "create sermon" form yet — items are
  currently seeded or would be created via direct API calls)
- Cart (checkout currently supports a single-item "Buy Now" flow; the
  `Order`/`OrderItem` models support a real multi-item cart)
- Notifications (the `Notification` model and channel enum exist; nothing
  enqueues them yet — see the `TODO` in the Paystack webhook)
- Gallery album detail pages, Event model (events currently reuse
  `LiveStream`), search beyond Postgres `contains` filtering, audit log UI,
  S3 storage (interface + stub only, see above)

### A note on this environment

This codebase was generated in a sandboxed environment whose network is
restricted to a small allow-list of package registries — it could not reach
Prisma's engine-binary CDN, so `prisma generate` / `prisma migrate dev`
could not be run here, and there was no live Postgres instance to connect
to. The schema and application code follow the standard Prisma workflow and
should work normally in a regular environment; run the Database Setup steps
above on your machine to generate the client, create tables, and confirm
everything compiles end-to-end. Please run `npm run build` and fix anything
environment-specific (e.g. exact Next.js/React/Tailwind patch versions) that
turns up.
