-- LifeLink Database Initialization Script
-- Target: Supabase-hosted PostgreSQL with PostGIS
-- Run this directly in Supabase's SQL Editor

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('donor', 'hospital_admin', 'ngo_admin')),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Donors Table (1-to-1 with User)
CREATE TABLE IF NOT EXISTS donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blood_type TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Hospitals Table (1-to-1 with User admin account)
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false
);

-- 5. Inventory Table (Unique stock entry per hospital, blood type, and component)
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    blood_type TEXT NOT NULL,
    component TEXT NOT NULL CHECK (component IN ('whole_blood', 'plasma', 'platelets')),
    units INTEGER NOT NULL DEFAULT 0 CHECK (units >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_hospital_inventory UNIQUE (hospital_id, blood_type, component)
);

-- 6. Emergency Requests Table
CREATE TABLE IF NOT EXISTS emergency_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    blood_type TEXT NOT NULL,
    component TEXT NOT NULL,
    units_needed INTEGER NOT NULL CHECK (units_needed > 0),
    urgency TEXT NOT NULL CHECK (urgency IN ('critical', 'high', 'normal')),
    radius_km INTEGER NOT NULL CHECK (radius_km > 0),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'fulfilled', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Request Responses Table (Unique response per donor per emergency request)
CREATE TABLE IF NOT EXISTS request_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES emergency_requests(id) ON DELETE CASCADE,
    donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
    response TEXT NOT NULL DEFAULT 'pending' CHECK (response IN ('pending', 'confirmed', 'declined')),
    responded_at TIMESTAMPTZ,
    CONSTRAINT uq_request_donor UNIQUE (request_id, donor_id)
);

-- 8. NGOs Table (1-to-1 with User)
CREATE TABLE IF NOT EXISTS ngos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- 9. Camps Table
CREATE TABLE IF NOT EXISTS camps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ngo_id UUID NOT NULL REFERENCES ngos(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    date DATE NOT NULL,
    target_blood_types TEXT[] NOT NULL
);

-- 10. Spatial GIST Indexes
CREATE INDEX IF NOT EXISTS idx_donors_location ON donors USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_camps_location ON camps USING GIST (location);

-- 11. Foreign Key and Query Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_donors_user_id ON donors(user_id);
CREATE INDEX IF NOT EXISTS idx_donors_blood_type_available ON donors(blood_type, available);
CREATE INDEX IF NOT EXISTS idx_hospitals_user_id ON hospitals(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_hospital_id ON inventory(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_hospital_id ON emergency_requests(hospital_id);
CREATE INDEX IF NOT EXISTS idx_emergency_requests_status ON emergency_requests(status);
CREATE INDEX IF NOT EXISTS idx_request_responses_request_id ON request_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_donor_id ON request_responses(donor_id);
CREATE INDEX IF NOT EXISTS idx_ngos_user_id ON ngos(user_id);
CREATE INDEX IF NOT EXISTS idx_camps_ngo_id ON camps(ngo_id);
