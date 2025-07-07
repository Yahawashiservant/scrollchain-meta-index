#!/bin/bash
set -e

echo "🌀 Starting full ScrollPlanet environment setup…"

# 1) Mitigate parse-duration vulnerability
if [[ -x mitigate-parse-duration.sh ]]; then
  echo "→ Mitigating parse-duration…"
  ./mitigate-parse-duration.sh
else
  echo "⚠ mitigate-parse-duration.sh not found; skipping"
fi

# 2) Bootstrap Hardhat & Supabase client
if [[ -x ScrollPlanet-SetupDevEnv.sh ]]; then
  echo "→ Setting up Hardhat + Supabase…"
  ./ScrollPlanet-SetupDevEnv.sh
else
  echo "⚠ ScrollPlanet-SetupDevEnv.sh not found; skipping"
fi

# 3) Integrate 369× amplification
if [[ -x ScrollPlanet-IntegrateAmplification.sh ]]; then
  echo "→ Applying 369× amplification to core modules…"
  ./ScrollPlanet-IntegrateAmplification.sh
else
  echo "⚠ ScrollPlanet-IntegrateAmplification.sh not found; skipping"
fi

# 4) Launch Postgres (Docker) & run schema migration
echo "→ Spinning up Postgres via Docker & migrating schema…"
docker rm -f scroll-postgres 2>/dev/null || true
docker run -d --name scroll-postgres \
  -e POSTGRES_USER=sp_user -e POSTGRES_DB=scroll_db \
  -p 5432:5432 postgres:13
echo "→ Waiting for Postgres to be ready…"
until docker exec scroll-postgres pg_isready -U sp_user >/dev/null 2>&1; do sleep 1; done
docker exec -i scroll-postgres psql -U sp_user -d scroll_db < sql/schema.sql
echo "→ Schema applied."

# 5) Compile & deploy QDAO via Hardhat
echo "→ Compiling & deploying QDAO…"
cd contracts
npx hardhat compile
npx hardhat run --network localhost scripts/deploy.js
cd ..
echo "→ QDAO deployed."

# 6) Sync & Smoke-test
echo "→ Running Supabase webhook sync in background…"
node -e "require('./scripts/webhookSync.js')"
echo "→ Populating a test entropy batch…"
node -e "require('./scripts/injectTorusAndSync.js').inject(42).then(()=>console.log('Injected seed 42'))"

# 7) Run unit tests
echo "→ Running Jest tests…"
npm test

echo "✅ Full ScrollPlanet setup and smoke-test complete!"
