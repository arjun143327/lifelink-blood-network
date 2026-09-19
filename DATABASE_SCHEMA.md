# Database Schema (Postgres + PostGIS, hosted on Supabase)

Enable PostGIS once per database: `CREATE EXTENSION IF NOT EXISTS postgis;`

## users
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| email | text, unique | |
| password_hash | text | bcrypt |
| role | text | `donor` \| `hospital_admin` \| `ngo_admin` |
| name | text | |
| created_at | timestamptz | default now() |

## donors
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| blood_type | text | e.g. `O-` |
| location | geography(Point, 4326) | PostGIS point |
| available | boolean | default true |
| updated_at | timestamptz | |

## hospitals
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | admin account |
| name | text | |
| location | geography(Point, 4326) | |
| verified | boolean | default false — future: manual approval flow |

## inventory
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| hospital_id | uuid, FK → hospitals.id | |
| blood_type | text | |
| component | text | `whole_blood` \| `plasma` \| `platelets` |
| units | integer | |
| updated_at | timestamptz | |

## emergency_requests
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| hospital_id | uuid, FK → hospitals.id | |
| blood_type | text | |
| component | text | |
| units_needed | integer | |
| urgency | text | `critical` \| `high` \| `normal` |
| radius_km | integer | |
| status | text | `open` \| `fulfilled` \| `expired` |
| created_at | timestamptz | |

## request_responses
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| request_id | uuid, FK → emergency_requests.id | |
| donor_id | uuid, FK → donors.id | |
| response | text | `pending` \| `confirmed` \| `declined` |
| responded_at | timestamptz | nullable |

## ngos
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| user_id | uuid, FK → users.id | |
| name | text | |

## camps
| column | type | notes |
|---|---|---|
| id | uuid, PK | |
| ngo_id | uuid, FK → ngos.id | |
| title | text | |
| location | geography(Point, 4326) | |
| date | date | |
| target_blood_types | text[] | |

---

## Key spatial query (donor matching)

```sql
SELECT d.*, ST_Distance(d.location, :hospital_point) AS distance_m
FROM donors d
WHERE d.available = true
  AND d.blood_type = :blood_type
  AND ST_DWithin(d.location, :hospital_point, :radius_meters)
ORDER BY distance_m
LIMIT 50;
```

## Notes
- Store all locations as `geography(Point, 4326)` (WGS84 lat/lng) — `ST_DWithin`/`ST_Distance`
  then work in meters directly.
- Indexes: add a GIST index on every `location` column — required for PostGIS queries to be fast:
  `CREATE INDEX ON donors USING GIST (location);`
- This schema is a starting point — whoever builds the backend should adjust as needed, but
  update this file in the same change so it stays accurate.
