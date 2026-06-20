-- Migration for the slot-capacity + admin slot-blocking feature.
--
-- Why this is needed: spring.jpa.hibernate.ddl-auto is "validate" in
-- application-prod.yml (Hibernate refuses to auto-alter the production
-- schema), so schema changes must be applied manually here before
-- deploying the new backend JAR.
--
-- How to run:
--   psql "<render mavuti-db connection string>" -f migration-slot-capacity.sql
--   (or paste into Render's SQL console / any Postgres client)
--
-- Run this BEFORE deploying the new backend build — the new code expects
-- both changes below to already exist.

-- 1. Each hourly slot now holds up to 20 bookings instead of exactly 1,
--    so the old "one booking per (date, time)" constraint must go.
ALTER TABLE appointment DROP CONSTRAINT IF EXISTS uk_appointment_slot;

-- Composite index to keep "count bookings for this slot" and the
-- availability query fast without the old unique constraint.
CREATE INDEX IF NOT EXISTS idx_appointment_date_time
    ON appointment (appointment_date, appointment_time);

-- 2. New table backing admin-blocked slots (e.g. a 10:00-11:00 meeting).
CREATE TABLE IF NOT EXISTS blocked_slot (
    id            BIGSERIAL PRIMARY KEY,
    blocked_date  DATE        NOT NULL,
    blocked_time  TIME        NOT NULL,
    reason        VARCHAR(200),
    blocked_by    VARCHAR(20),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uk_blocked_slot UNIQUE (blocked_date, blocked_time)
);

CREATE INDEX IF NOT EXISTS idx_blocked_slot_date ON blocked_slot (blocked_date);
