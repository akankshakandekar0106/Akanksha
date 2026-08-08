/**
 * KUMBH SARTHI - Supabase PostgreSQL Database Schema Generator
 * SQL Table Creation, Foreign Keys, Indexes, RLS Policies & Seed Scripts
 */

export const SUPABASE_SQL_SCHEMA = `-- ============================================================
-- KUMBH SARTHI - PostgreSQL Schema for Supabase
-- Smart Kumbh Mela Crowd Management & Pilgrim Assistance
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SYSTEM SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    low_threshold INT NOT NULL DEFAULT 40,
    medium_threshold INT NOT NULL DEFAULT 70,
    high_threshold INT NOT NULL DEFAULT 100,
    demo_mode BOOLEAN NOT NULL DEFAULT true,
    language VARCHAR(10) DEFAULT 'en',
    auto_alert_trigger BOOLEAN DEFAULT true,
    kumbh_year VARCHAR(50) DEFAULT '2026-2027',
    city_name VARCHAR(100) DEFAULT 'Nashik',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone_number TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'visitor' CHECK (role IN ('visitor', 'admin', 'police', 'medical', 'volunteer')),
    organization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
    location_id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    description TEXT,
    crowd_level VARCHAR(20) DEFAULT 'LOW' CHECK (crowd_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    crowd_percentage INT DEFAULT 0,
    estimated_people INT DEFAULT 0,
    capacity INT DEFAULT 10000,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'RESTRICTED', 'EMERGENCY_ONLY')),
    facilities TEXT[],
    opening_time VARCHAR(50),
    closing_time VARCHAR(50),
    emergency_contact VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. IOT SENSORS TABLE
CREATE TABLE IF NOT EXISTS public.iot_sensors (
    sensor_id VARCHAR(50) PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    location_id VARCHAR(50) REFERENCES public.locations(location_id) ON DELETE CASCADE,
    sensor_type VARCHAR(30) DEFAULT 'IR' CHECK (sensor_type IN ('IR', 'ULTRASONIC', 'CAMERA_COUNTER', 'OTHER')),
    status VARCHAR(20) DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE')),
    last_value INT DEFAULT 0,
    battery_level INT DEFAULT 100,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CROWD READINGS TABLE
CREATE TABLE IF NOT EXISTS public.crowd_readings (
    reading_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_id VARCHAR(50) REFERENCES public.iot_sensors(sensor_id) ON DELETE CASCADE,
    location_id VARCHAR(50) REFERENCES public.locations(location_id) ON DELETE CASCADE,
    people_count INT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. EMERGENCY REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.emergencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    emergency_type VARCHAR(50) NOT NULL,
    description TEXT,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    location_name VARCHAR(150),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'NEW' CHECK (status IN ('NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED')),
    assigned_team VARCHAR(100),
    resolution_notes TEXT
);

-- 7. LOST & FOUND ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(10) NOT NULL CHECK (type IN ('LOST', 'FOUND')),
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    date_time VARCHAR(100),
    photo_url TEXT,
    contact_name VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'LOST' CHECK (status IN ('LOST', 'FOUND', 'MATCHED', 'RETURNED', 'CLOSED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    location_name VARCHAR(150),
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'DANGER', 'CRITICAL')),
    category VARCHAR(50) DEFAULT 'GENERAL',
    created_by VARCHAR(100) DEFAULT 'Kumbh Control Room',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true
);

-- 9. PARKING FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.parking (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    occupied_spaces INT NOT NULL DEFAULT 0,
    available_spaces INT NOT NULL DEFAULT 0,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'LIMITED', 'FULL')),
    vehicle_types TEXT[],
    fee VARCHAR(50),
    contact VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. MEDICAL FACILITIES TABLE
CREATE TABLE IF NOT EXISTS public.medical_facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    available_beds INT DEFAULT 0,
    emergency_available BOOLEAN DEFAULT true,
    contact VARCHAR(50),
    opening_hours VARCHAR(50),
    doctors_on_duty INT DEFAULT 1
);

-- 11. POLICE POINTS TABLE
CREATE TABLE IF NOT EXISTS public.police_points (
    id VARCHAR(50) PRIMARY KEY,
    station_name VARCHAR(150) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    available_officers INT DEFAULT 10,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    incharge_officer VARCHAR(100)
);

-- 12. FOOD & WATER POINTS TABLE
CREATE TABLE IF NOT EXISTS public.food_water_points (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('FOOD', 'WATER', 'BOTH')),
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    opening_time VARCHAR(50),
    closing_time VARCHAR(50),
    status VARCHAR(20) DEFAULT 'OPERATIONAL',
    organizer VARCHAR(150),
    is_free BOOLEAN DEFAULT true,
    cleanliness_rating NUMERIC(2, 1) DEFAULT 4.5
);

-- 13. PUBLIC TOILETS TABLE
CREATE TABLE IF NOT EXISTS public.toilets (
    id VARCHAR(50) PRIMARY KEY,
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    male_units INT DEFAULT 10,
    female_units INT DEFAULT 10,
    accessible_facility BOOLEAN DEFAULT true,
    cleanliness_status VARCHAR(30) DEFAULT 'GOOD',
    last_updated VARCHAR(50)
);

-- 14. ACCOMMODATION TABLE
CREATE TABLE IF NOT EXISTS public.accommodations (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    location_name VARCHAR(150) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL,
    available_rooms INT DEFAULT 0,
    capacity INT DEFAULT 100,
    price_range VARCHAR(50),
    contact VARCHAR(50)
);

-- 15. TRANSPORT TABLE
CREATE TABLE IF NOT EXISTS public.transport (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(30) NOT NULL,
    route_or_station TEXT,
    location_name VARCHAR(150),
    availability VARCHAR(20) DEFAULT 'HIGH',
    operating_hours VARCHAR(50),
    crowd_level VARCHAR(20) DEFAULT 'LOW',
    fare VARCHAR(50)
);

-- 16. ROUTES TABLE
CREATE TABLE IF NOT EXISTS public.routes (
    route_id VARCHAR(50) PRIMARY KEY,
    from_location_id VARCHAR(50) REFERENCES public.locations(location_id),
    to_location_id VARCHAR(50) REFERENCES public.locations(location_id),
    distance_km NUMERIC(5, 2),
    estimated_minutes INT,
    crowd_level VARCHAR(20) DEFAULT 'LOW',
    status VARCHAR(20) DEFAULT 'OPEN',
    via_points TEXT[],
    safety_score INT DEFAULT 8,
    notes TEXT
);

-- 17. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id VARCHAR(50) PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    start_time VARCHAR(50),
    end_time VARCHAR(50),
    location_name VARCHAR(150),
    expected_crowd INT,
    status VARCHAR(20) DEFAULT 'UPCOMING',
    description TEXT,
    is_shahi_snan BOOLEAN DEFAULT false
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_locations_category ON public.locations(category);
CREATE INDEX IF NOT EXISTS idx_locations_crowd ON public.locations(crowd_level);
CREATE INDEX IF NOT EXISTS idx_readings_sensor ON public.crowd_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_readings_time ON public.crowd_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emergencies_status ON public.emergencies(status);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.alerts(active);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_sensors ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ ACCESS FOR ALL PILGRIM APP DATA
CREATE POLICY "Public Read Locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public Read Alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Public Read Parking" ON public.parking FOR SELECT USING (true);
CREATE POLICY "Public Read LostFound" ON public.lost_found_items FOR SELECT USING (true);

-- PILGRIM SOS INSERT PERMISSION
CREATE POLICY "Public Create Emergency" ON public.emergencies FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Create LostFound" ON public.lost_found_items FOR INSERT WITH CHECK (true);

-- ADMIN & SECURITY UPDATE PERMISSIONS
CREATE POLICY "Admin All Access Locations" ON public.locations FOR ALL USING (true);
CREATE POLICY "Admin All Access Emergencies" ON public.emergencies FOR ALL USING (true);

-- ============================================================
-- REALTIME PUBLICATION ENABLEMENT
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergencies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.iot_sensors;

-- ============================================================
-- AUTOMATIC CROWD PERCENTAGE & STATUS CALCULATION TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_location_crowd_status()
RETURNS TRIGGER AS $$
DECLARE
    cap INT;
    pct INT;
    lvl VARCHAR(20);
BEGIN
    SELECT capacity INTO cap FROM public.locations WHERE location_id = NEW.location_id;
    IF cap IS NULL OR cap = 0 THEN
        cap := 10000;
    END IF;

    pct := (NEW.people_count * 100) / cap;

    IF pct <= 40 THEN
        lvl := 'LOW';
    ELSIF pct <= 70 THEN
        lvl := 'MEDIUM';
    ELSIF pct <= 100 THEN
        lvl := 'HIGH';
    ELSE
        lvl := 'CRITICAL';
    END IF;

    UPDATE public.locations
    SET estimated_people = NEW.people_count,
        crowd_percentage = pct,
        crowd_level = lvl,
        updated_at = NOW()
    WHERE location_id = NEW.location_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_crowd_reading_update
AFTER INSERT ON public.crowd_readings
FOR EACH ROW
EXECUTE FUNCTION update_location_crowd_status();
`;

export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;
