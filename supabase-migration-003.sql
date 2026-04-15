-- ═══════════════════════════════════════════════════════
-- MIGRATION 003 — Prayer Archive + False-Light Scan Results
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS prayers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'uploaded' CHECK (source IN ('uploaded', 'generated', 'edited')),
  scan_result JSONB DEFAULT '{}',
  scan_overall TEXT CHECK (scan_overall IN ('pass', 'warn', 'fail')),
  scan_critical_count INT DEFAULT 0,
  scan_warn_count INT DEFAULT 0,
  structure_pct INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prayers_practitioner ON prayers(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_prayers_session ON prayers(session_id);
CREATE INDEX IF NOT EXISTS idx_prayers_scan_overall ON prayers(scan_overall);

ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners view own prayers"
  ON prayers FOR SELECT USING (auth.uid() = practitioner_id);
CREATE POLICY "Practitioners insert own prayers"
  ON prayers FOR INSERT WITH CHECK (auth.uid() = practitioner_id);
CREATE POLICY "Practitioners update own prayers"
  ON prayers FOR UPDATE USING (auth.uid() = practitioner_id);
CREATE POLICY "Practitioners delete own prayers"
  ON prayers FOR DELETE USING (auth.uid() = practitioner_id);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION update_prayers_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prayers_updated_at ON prayers;
CREATE TRIGGER trg_prayers_updated_at
  BEFORE UPDATE ON prayers
  FOR EACH ROW EXECUTE FUNCTION update_prayers_updated_at();
