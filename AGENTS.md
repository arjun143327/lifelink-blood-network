# LifeLink — Real-Time Blood Availability & Donor Network

This file is the persistent context for AI coding agents (Antigravity, Claude Code, Cursor, etc.)
working on this repo. Read this in full before making changes. It is also the onboarding doc
for human teammates — if you're a teammate, read this before touching any code.

## 1. What This Project Is

A full-stack web platform solving a real logistics problem: India loses over 1 million units of
blood a year to a visibility gap, not a donation gap — hospitals can't see who has surplus stock
or who's available to donate nearby, in real time.

LifeLink connects three roles on one system:
- **Donors** — register blood type + location + availability, get notified for nearby emergencies
- **Hospital Admins** — manage blood inventory, post emergency requests, search other hospitals' stock
- **NGO Admins** — organize donation camps, notify relevant donors

This is a **semester project for a Full-Stack Web Development course, 3rd year**, built by a team
of 3. Grading cares about visible full-stack depth (real backend, real auth, real DB design) —
not just a working demo. Do not take shortcuts that hide engineering work behind managed services.

## 2. Tech Stack (do not substitute without asking the team)

| Layer | Choice |
|---|---|
| Frontend | Next.js (App Router) + Tailwind CSS + shadcn/ui + Framer Motion + Mapbox GL JS |
| Backend | Python + FastAPI |
| Database | Supabase-hosted PostgreSQL + PostGIS extension |
| DB access | Backend connects directly to Postgres (via SQLAlchemy/asyncpg) — NOT via Supabase's
  client SDK or auto-generated REST API. Supabase is used purely as a managed Postgres host here. |
| Auth | Custom JWT auth built in FastAPI (passlib/bcrypt for hashing, python-jose for JWT) — NOT
  Supabase Auth |
| Notifications | Resend (email) called from backend business logic |
| Deployment (target) | Frontend → Vercel · Backend → Render or Railway · DB → Supabase (all free tier) |

**Why not just use Supabase Auth/API/Edge Functions for everything?** We deliberately keep backend
logic in our own FastAPI service so there's real, visible backend engineering to grade — auth,
API design, matching algorithm, middleware. Supabase is our database host, nothing more.

## 3. Repo Structure (monorepo)

```
/lifelink
  /backend          → FastAPI app (see backend/AGENTS.md if present for backend-specific notes)
    /app
      /routers       → one file per resource: donors.py, hospitals.py, requests.py, camps.py, auth.py
      /models        → SQLAlchemy models
      /schemas       → Pydantic request/response schemas
      /services      → business logic (matching algorithm, notification triggers)
      /core          → config, db session, security/JWT utils
      main.py
    requirements.txt
    .env.example
  /frontend          → Next.js app
    /app             → routes (App Router)
    /components
    /lib
    .env.local.example
  /docs
    API_CONTRACT.md  → source of truth for all API endpoints — frontend and backend must agree
                        before building against a change
    DATABASE_SCHEMA.md
    TASKS.md         → task breakdown per person
  AGENTS.md          → this file
```

## 4. Team Split (so agents don't step on each other's work)

- **Person A (backend + Supabase connectivity)** — owns `/backend`, database schema, API
  contract, matching logic, auth
- **Person B (frontend)** — owns `/frontend`, works against `/docs/API_CONTRACT.md` using mocked
  responses until real endpoints are ready, so no blocking on backend progress
- **Person C** — TBD split, likely notifications + deployment + testing, or co-owns frontend

**Rule for agents:** when working in `/backend`, do not modify `/frontend` files and vice versa,
unless explicitly asked. When an API endpoint's shape changes, update `/docs/API_CONTRACT.md` in
the same change — that file is the contract both sides code against.

## 5. Core Feature: Donor Matching (the technical centerpiece)

When a hospital creates an emergency request (blood type + component + units), the backend must
return nearby **available** donors of a matching blood type, ranked by distance, using PostGIS:

```sql
SELECT * FROM donors
WHERE ST_DWithin(location, :hospital_location, :radius_meters)
  AND blood_type = :blood_type
  AND available = true
ORDER BY ST_Distance(location, :hospital_location);
```

This lives in `backend/app/services/matching.py`. This is the feature to showcase in the demo and
report — it's genuine spatial-query backend work, not CRUD.

## 6. Conventions

- **API responses**: consistent JSON shape, errors as `{ "detail": "message" }` (FastAPI default)
- **Auth**: JWT in `Authorization: Bearer <token>` header; role (`donor` / `hospital_admin` /
  `ngo_admin`) encoded in the token and checked via FastAPI dependency, not re-derived client-side
- **Env vars**: never commit `.env` — always update the matching `.env.example` when adding a new
  variable
- **Commits**: prefix with area, e.g. `backend: add donor matching endpoint`,
  `frontend: build hospital dashboard`

## 7. Not Doing (out of scope for v1 — don't build unless asked)

- WhatsApp bot / Twilio integration
- Live e-RaktKosh scraping (use seeded/mock data for a few cities instead)
- Hospital-to-hospital transfer negotiation workflow beyond a basic request/accept

## 8. Current Status

See `/docs/TASKS.md` for what's done, in progress, and not started.
