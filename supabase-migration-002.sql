-- ═══════════════════════════════════════════════════════
-- DIVINE ALIGNMENT — Migration 002: Deliverance Sessions
-- Run this in Supabase SQL Editor AFTER the initial schema
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS deliverance_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  practitioner_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id),
  session_date DATE DEFAULT NOW(),
  session_type TEXT DEFAULT 'sleep_deliverance',
  seal_confirmed BOOLEAN DEFAULT FALSE,
  calibration_passed BOOLEAN DEFAULT FALSE,
  gate_results JSONB DEFAULT '{}',
  spirits_found TEXT[] DEFAULT '{}',
  spirits_cleared TEXT[] DEFAULT '{}',
  alliances_broken TEXT[] DEFAULT '{}',
  root_origin TEXT,
  root_details JSONB DEFAULT '{}',
  body_systems_tested JSONB DEFAULT '{}',
  energy_systems_tested JSONB DEFAULT '{}',
  prayers_completed TEXT[] DEFAULT '{}',
  session_notes TEXT,
  follow_up_items TEXT[] DEFAULT '{}',
  morning_retest_notes TEXT,
  generated_prayer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverance_practitioner ON deliverance_sessions(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_deliverance_client ON deliverance_sessions(client_id);

ALTER TABLE deliverance_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view own deliverance sessions"
  ON deliverance_sessions FOR SELECT USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can insert deliverance sessions"
  ON deliverance_sessions FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can update own deliverance sessions"
  ON deliverance_sessions FOR UPDATE USING (auth.uid() = practitioner_id);

CREATE POLICY "Clients can view their deliverance sessions"
  ON deliverance_sessions FOR SELECT USING (
    auth.uid() IN (
      SELECT p.id FROM profiles p
      JOIN clients c ON c.email = p.email
      WHERE c.id = deliverance_sessions.client_id
    )
  );
