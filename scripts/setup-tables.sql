-- THE DEN HOUSE Database Schema
-- Creates all required tables for the music production platform

-- Artifacts table - stores all created beats, presets, and projects
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default-tenant',
  name TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'beat', -- beat, preset, project, plugin
  status TEXT NOT NULL DEFAULT 'draft', -- draft, ready, published
  params JSONB DEFAULT '{}',
  entropy JSONB DEFAULT '{"density": 0.5, "coherence": 0.5, "phase": 0.5, "space": 0.5}',
  pattern JSONB DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Receipts table - audit trail for all mutations
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default-tenant',
  artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
  request_id UUID,
  mutation_ops JSONB NOT NULL,
  safety_caps JSONB DEFAULT '{"headroom_db_min": 12}',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sessions table - stores session mappings (channel to artifact)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL DEFAULT 'default-tenant',
  name TEXT NOT NULL DEFAULT 'Untitled Session',
  channel_map JSONB NOT NULL DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scenes table - playlist of session states for live performance
CREATE TABLE IF NOT EXISTS scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  state JSONB NOT NULL DEFAULT '{}',
  crossfade_ms INTEGER DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_artifacts_tenant ON artifacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_kind ON artifacts(kind);
CREATE INDEX IF NOT EXISTS idx_artifacts_status ON artifacts(status);
CREATE INDEX IF NOT EXISTS idx_receipts_artifact ON receipts(artifact_id);
CREATE INDEX IF NOT EXISTS idx_receipts_tenant ON receipts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sessions_tenant ON sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_scenes_session ON scenes(session_id);

-- Insert some demo artifacts for THE DEN HOUSE
INSERT INTO artifacts (name, kind, status, params, entropy, created_by) VALUES
  ('Trap Soul Beat', 'beat', 'ready', '{"bpm": 85, "key": "Am"}', '{"density": 0.6, "coherence": 0.7, "phase": 0.5, "space": 0.8}', 'system'),
  ('Lo-Fi Jazz Loop', 'beat', 'ready', '{"bpm": 72, "key": "Dm"}', '{"density": 0.4, "coherence": 0.8, "phase": 0.6, "space": 0.9}', 'system'),
  ('808 Boom Bap', 'beat', 'ready', '{"bpm": 90, "key": "Cm"}', '{"density": 0.7, "coherence": 0.6, "phase": 0.4, "space": 0.5}', 'system'),
  ('R&B Groove', 'beat', 'ready', '{"bpm": 95, "key": "Gm"}', '{"density": 0.5, "coherence": 0.75, "phase": 0.55, "space": 0.7}', 'system'),
  ('Gospel Keys', 'preset', 'ready', '{"instrument": "rhodes", "reverb": 0.6}', '{"density": 0.3, "coherence": 0.9, "phase": 0.7, "space": 0.85}', 'system'),
  ('Dirty South 808', 'preset', 'ready', '{"instrument": "808_bass", "distortion": 0.4}', '{"density": 0.8, "coherence": 0.5, "phase": 0.3, "space": 0.4}', 'system')
ON CONFLICT DO NOTHING;
