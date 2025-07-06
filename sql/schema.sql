CREATE TABLE entropy_trails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ NOT NULL,
  qhash TEXT NOT NULL,
  sample FLOAT8[] NOT NULL,
  note TEXT
);

CREATE TABLE prophecy_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trail_id UUID REFERENCES entropy_trails(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  text TEXT NOT NULL
);
