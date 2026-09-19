# Tasks

Update this file as work progresses — check items off, add new ones. Agents should read this to
know what's already done before starting new work, and update it after finishing a task.

## Setup
- [ ] Create Supabase project, enable PostGIS extension
- [ ] Create tables per `docs/DATABASE_SCHEMA.md`
- [x] Scaffold FastAPI app (`/backend`) with `.env.example`
- [ ] Scaffold Next.js app (`/frontend`) with `.env.local.example`
- [ ] Confirm `docs/API_CONTRACT.md` — resolve open questions section before building list views

## Backend (Person A)
- [x] DB connection + SQLAlchemy models
- [ ] Auth: signup/login, JWT issuing, password hashing
- [ ] Auth middleware/dependency for role checks
- [ ] Donor profile endpoints
- [ ] Hospital inventory endpoints
- [ ] Hospital search endpoint (spatial query)
- [ ] Emergency request creation + matching algorithm
- [ ] Request response endpoint (donor confirms/declines)
- [ ] Camp CRUD endpoints
- [ ] Email notification on emergency request match (Resend)
- [ ] Seed script: mock donors/hospitals/inventory for 2-3 cities

## Frontend (Person B)
- [ ] Auth pages (signup/login, role selection)
- [ ] Donor: onboarding, dashboard, profile, availability toggle
- [ ] Hospital: dashboard, inventory management, emergency request form, request tracking
- [ ] NGO: dashboard, camp creation, camp list
- [ ] Shared map component (Mapbox GL)
- [ ] Public search/landing page
- [ ] Wire up against `API_CONTRACT.md` (mock data until backend endpoints ready)

## Person C (TBD final split)
- [ ] Notification wiring / testing
- [ ] Deployment: frontend → Vercel, backend → Render/Railway
- [ ] End-to-end testing of core flow (donor registers → hospital posts request → donor notified
      → donor responds → hospital sees update)
- [ ] Report/documentation support

## Stretch (only if time remains)
- [ ] SMS fallback via Twilio
- [ ] Hospital-to-hospital transfer request flow
- [ ] Live e-RaktKosh data ingestion
