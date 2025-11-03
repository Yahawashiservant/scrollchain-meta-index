-- Create receipts table for auditable operations
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL,
  intent TEXT,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('artifact', 'preset', 'session', 'scene')),
  resource_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending')),
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_receipts_request_id ON receipts(request_id);
CREATE INDEX IF NOT EXISTS idx_receipts_resource ON receipts(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at DESC);

-- Enable RLS
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read receipts
CREATE POLICY "Public read access" ON receipts FOR SELECT USING (true);

-- Policy: Service role can insert receipts
CREATE POLICY "Service role insert" ON receipts FOR INSERT WITH CHECK (true);
