-- ═══════════════════════════════════════════════════════
-- SLEEP DELIVERANCE DIAGNOSTIC — Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL)
-- ═══════════════════════════════════════════════════════

-- Profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('practitioner', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients (practitioner's client directory)
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions (diagnostic sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  primary_symptom TEXT,
  symptom_area TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'follow_up')),
  diagnostic_data JSONB DEFAULT '{}',
  notes JSONB DEFAULT '{}',
  generated_prayer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_practitioner ON clients(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_practitioner ON sessions(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_sessions_client_email ON sessions(client_email);

-- ═══════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ═══════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Clients: practitioners can manage their own clients
CREATE POLICY "Practitioners can view own clients"
  ON clients FOR SELECT USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can insert clients"
  ON clients FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can update own clients"
  ON clients FOR UPDATE USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can delete own clients"
  ON clients FOR DELETE USING (auth.uid() = practitioner_id);

-- Sessions: practitioners see their sessions, clients see sessions linked to them
CREATE POLICY "Practitioners can view own sessions"
  ON sessions FOR SELECT USING (auth.uid() = practitioner_id);

CREATE POLICY "Clients can view their sessions"
  ON sessions FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE email = sessions.client_email
    )
  );

CREATE POLICY "Practitioners can insert sessions"
  ON sessions FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can update own sessions"
  ON sessions FOR UPDATE USING (auth.uid() = practitioner_id);

-- ═══════════════════════════════════════════════════════
-- Auto-create profile on signup (trigger)
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
