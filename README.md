# MedPoint

> **Proprietary** — Copyright (c) 2026 AllenDG. All Rights Reserved. See [LICENSE](./LICENSE).

A role-based hospital management web application with three portals — Public Site, Help Desk, and Assistant Nurse — in a single secure, real-time system.

---

## Portals

| Portal | Access | Purpose |
|---|---|---|
| **Public Site** | Unauthenticated | Browse doctors, book appointments, contact hospital |
| **Help Desk** | `HELPDESK` role | Manage tickets, SLA monitoring, appointment queues |
| **Nurse Portal** | `NURSE` role | Triage queue, record vitals, escalate to doctors |

---

## Tech Stack

**Frontend** — React 19 · TypeScript · Vite 6 · Tailwind CSS v4 · TanStack Query v5 · Zustand · React Hook Form · Zod

**Backend** — Node.js · Express · TypeScript · Prisma · PostgreSQL · JWT (refresh token rotation)

**Testing** — Vitest · React Testing Library · Playwright

---

## Architecture

Role-based Component & Backend Architecture (RCBA):

- One frontend codebase, route-split by role with lazy loading per portal
- Clean architecture backend: Domain → Application → Infrastructure → Presentation
- RBAC enforced server-side on every protected request — frontend guards are UX only
- Full audit trail on all triage and ticket mutations

---

## Project Structure

```
medpoint/
├── client/          # React frontend
│   └── src/
│       ├── app/routes/      # AppRouter, ProtectedRoute, role layouts
│       ├── components/      # ui/ (primitives) + shared/ (Navbar, states)
│       ├── features/        # auth/ · public-site/ · helpdesk/ · nurse/
│       ├── hooks/           # useDebounce, usePagination, useMediaQuery
│       ├── lib/             # apiClient (Axios + interceptors), queryClient
│       ├── store/           # ui.store (toasts, sidebar)
│       └── types/api.ts     # shared DTOs mirroring backend contracts
└── server/          # Node.js + Express backend
    ├── prisma/schema.prisma
    └── src/
        ├── domain/          # entities, value-objects, pure domain rules
        ├── application/     # use-cases, repository interfaces
        ├── infrastructure/  # JWT, audit log, DB repositories
        └── presentation/    # routes, controllers, middleware, error handler
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Setup

```bash
# 1. Clone
git clone https://github.com/<your-username>/medpoint.git
cd medpoint

# 2. Install all workspaces
npm install

# 3. Configure environment
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 4. Database setup
cd server
npx prisma migrate dev --name init
npx prisma generate

# 5. Run both client and server
cd ..
npm run dev
```

Client runs on `http://localhost:3000` · API runs on `http://localhost:4000`

---

## Environment Variables

See [`.env.example`](./.env.example) for all required variables. **Never commit `.env`.**

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Client → API base URL |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_EXPIRES_IN` | Access token TTL (default: `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (default: `7d`) |

---

## Scripts

```bash
npm run dev        # Start client + server concurrently
npm run build      # Build both workspaces
npm run lint       # Lint both workspaces
npm run test       # Run unit tests (Vitest)
npm run test:e2e   # Run e2e tests (Playwright)
```

---

## Security

- JWT access tokens expire in 15 minutes with refresh token rotation
- RBAC enforced at middleware layer on every protected API route
- Rate limiting on all public endpoints
- All secrets must be set via environment variables — never hardcoded
- Full audit logging for triage and ticket mutations

---

## License

Copyright (c) 2026 AllenDG. All Rights Reserved.

This project is **proprietary software**. Unauthorized copying, distribution, or use is strictly prohibited. See [LICENSE](./LICENSE) for full terms.
