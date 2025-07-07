#!/bin/bash
set -euo pipefail

echo "🌀 ScrollPlanet Full Launch — starting orchestration…"

# 1) Install JS deps
echo "→ Installing npm dependencies…"
npm install

# 2) Mitigate parse-duration vuln (if present)
if [[ -x mitigate-parse-duration.sh ]]; then
  echo "→ Running parse-duration mitigation…"
  ./mitigate-parse-duration.sh
fi

# 3) Setup Hardhat & Supabase client
if [[ -x ScrollPlanet-SetupDevEnv.sh ]]; then
  echo "→ Bootstrapping Hardhat & Supabase…"
  ./ScrollPlanet-SetupDevEnv.sh
fi

# 4) Integrate 369× amplification
if [[ -x ScrollPlanet-IntegrateAmplification.sh ]]; then
  echo "→ Applying 369× recursive amplification…"
  ./ScrollPlanet-IntegrateAmplification.sh
fi

# 5) Launch Postgres via Docker & run migrations
echo "→ Starting Postgres container…"
docker rm -f scroll-postgres 2>/dev/null || true
docker run -d --name scroll-postgres \
  -e POSTGRES_USER=sp_user -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=scroll_db -p 5432:5432 postgres:13

echo "→ Waiting for Postgres readiness…"
until docker exec scroll-postgres pg_isready -U sp_user; do sleep 1; done

echo "→ Applying SQL schema…"
docker exec -i scroll-postgres psql -U sp_user -d scroll_db < sql/schema.sql
if [[ -f sql/triggers.sql ]]; then
  docker exec -i scroll-postgres psql -U sp_user -d scroll_db < sql/triggers.sql
fi

# 6) Compile & deploy QDAO contract
echo "→ Compiling & deploying QDAO via Hardhat…"
pushd contracts >/dev/null
npx hardhat compile
npx hardhat run --network localhost scripts/deploy.js
popd >/dev/null

# 7) Start on-chain → Supabase sync in background
echo "→ Launching webhook sync…"
nohup node scripts/webhookSync.js >/dev/null 2>&1 &

# 8) Inject a test entropy batch
echo "→ Injecting test entropy trails (seed=42)…"
node -e "require('./scripts/injectTorusAndSync').inject(42).then(()=>console.log('⭐ Inject complete'))"

# 9) Build & preview front-end
echo "→ Building front-end…"
npm run build

echo "→ Starting local preview…"
npm run preview &

echo "✅ ScrollPlanet Full Launch complete! Dev server and preview are running."

