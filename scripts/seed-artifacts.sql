-- Create some seed artifacts for testing
INSERT INTO tokenized_assets (id, name, storage_uri, metadata, created_at)
VALUES
  (
    gen_random_uuid(),
    'Bass Lattice 1',
    'https://example.com/audio/bass1.wav',
    '{"type": "audio", "channel": "bass", "duration": 120}',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Pad Lattice 1',
    'https://example.com/audio/pad1.wav',
    '{"type": "audio", "channel": "pad", "duration": 120}',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Drum Lattice 1',
    'https://example.com/audio/drum1.wav',
    '{"type": "audio", "channel": "drum", "duration": 120}',
    NOW()
  ),
  (
    gen_random_uuid(),
    'Lead Lattice 1',
    'https://example.com/audio/lead1.wav',
    '{"type": "audio", "channel": "lead", "duration": 120}',
    NOW()
  )
ON CONFLICT DO NOTHING;
