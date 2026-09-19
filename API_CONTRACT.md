# API Contract

Source of truth for every endpoint. Frontend codes against this file (with mocked data) even
before an endpoint is implemented in the backend. Whoever changes an endpoint's shape updates
this file in the same commit/change.

Base URL (dev): `http://localhost:8000/api`

All authenticated requests send `Authorization: Bearer <token>`.

---

## Auth

### POST /auth/signup
Request:
```json
{ "email": "string", "password": "string", "role": "donor | hospital_admin | ngo_admin", "name": "string" }
```
Response `201`:
```json
{ "id": "uuid", "email": "string", "role": "string", "token": "jwt-string" }
```

### POST /auth/login
Request: `{ "email": "string", "password": "string" }`
Response `200`: `{ "token": "jwt-string", "role": "string", "id": "uuid" }`

---

## Donors

### POST /donors/profile  *(auth: donor)*
Create/update the logged-in donor's profile.
```json
{ "blood_type": "O- | O+ | A- | A+ | B- | B+ | AB- | AB+", "latitude": 0.0, "longitude": 0.0, "available": true }
```

### GET /donors/me  *(auth: donor)*
Returns the logged-in donor's own profile.

### PATCH /donors/availability  *(auth: donor)*
```json
{ "available": true }
```

---

## Hospitals — Inventory

### GET /hospitals/:id/inventory
Response: list of `{ "blood_type": "string", "component": "whole_blood | plasma | platelets", "units": 0, "updated_at": "iso-datetime" }`

### POST /hospitals/:id/inventory  *(auth: hospital_admin, own hospital only)*
```json
{ "blood_type": "string", "component": "string", "units": 0 }
```

### GET /hospitals/search?blood_type=O-&component=whole_blood&lat=..&lng=..&radius_km=10
Public. Returns hospitals with matching stock, sorted by distance.

---

## Emergency Requests

### POST /requests  *(auth: hospital_admin)*
```json
{ "blood_type": "string", "component": "string", "units_needed": 0, "urgency": "critical | high | normal", "radius_km": 10 }
```
Response `201`: request object + `matched_donor_count`.
Triggers backend matching (see AGENTS.md §5) and notification dispatch.

### GET /requests/:id  *(auth: hospital_admin who created it)*
Returns request + list of matched donors and their response status
(`pending | confirmed | declined`).

### POST /requests/:id/respond  *(auth: donor)*
```json
{ "response": "confirmed | declined" }
```

---

## Camps

### GET /camps?lat=..&lng=..&radius_km=20
Public. Upcoming camps near a location.

### POST /camps  *(auth: ngo_admin)*
```json
{ "title": "string", "location": { "lat": 0.0, "lng": 0.0 }, "date": "iso-date", "target_blood_types": ["O-", "AB+"] }
```

---

## Open Questions / TBD
- [ ] Pagination shape for list endpoints (donors search, camps list) — decide before frontend
      builds list views
- [ ] Rate limiting rules for POST /requests (mentioned in AGENTS.md as a "should have")
- [ ] Exact enum values for `component` — confirm whole list with backend owner
