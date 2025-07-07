#!/bin/bash
set -euo pipefail

echo "🔧 Cleaning package.json and launching ScrollPlanet…"

# 1) Strip out any lines starting with '#' (comments) so package.json is valid JSON
echo "→ Removing comment lines from package.json…"
grep -v '^[[:space:]]*#' package.json > package.clean.json
mv package.clean.json package.json

# 2) Ensure 'overrides' section is present
echo "→ Adding overrides for parse-duration if needed…"
jq ' .overrides += {
    "parse-duration": "^3.0.0",
    "ipfs-core-utils/parse-duration": "^3.0.0"
} ' package.json > pkg.tmp.json && mv pkg.tmp.json package.json

# 3) Install JS dependencies
echo "→ Installing npm dependencies…"
npm install

# 4) Run vulnerability mitigation script if present
if [[ -x mitigate-parse-duration.sh ]]; then
  echo "→ Mitigating parse-duration vulns…"
  ./mitigate-parse-duration.sh
fi

# 5) Bootstrap Hardhat & Supabase
if [[ -x ScrollPlanet-SetupDevEnv.sh ]]; then
  echo "→ Setting up Hardhat & Supabase…"
  ./ScrollPlanet-SetupDevEnv.sh
fi

# 6) Integrate 369× amplification
if [[ -x ScrollPlanet-IntegrateAmplification.sh ]]; then
  echo "→ Applying 369× amplification…"
  ./ScrollPlanet-IntegrateAmplification.sh
fi

# 7) Launch Postgres via Docker & run migrations
echo "→ Starting Postgres container…"
docker rm -f scroll-postgres 2>/dev/null || true
docker run -d --name scroll-postgres \
  -e POSTGRES_USER=sp_user -e POSTGRES_PASSWORD=pass \
  -e POSTGRES_DB=scroll_db -p 5432:5432 postgres:13

echo "→ Waiting for Postgres…"
until docker exec scroll-postgres pg_isready -U sp_user >/dev/null 2>&1; do sleep 1; done

echo "→ Applying SQL schema…"
docker exec -i scroll-postgres psql -U sp_user -d scroll_db < sql/schema.sql
if [[ -f sql/triggers.sql ]]; then
  docker exec -i scroll-postgres psql -U sp_user -d scroll_db < sql/triggers.sql
fi

# 8) Compile & deploy QDAO contract locally
echo "→ Compiling & deploying QDAO…"
pushd contracts >/dev/null
npx hardhat compile
npx hardhat run --network localhost scripts/deploy.js
popd >/dev/null

# 9) Start webhook sync & inject a test batch
echo "→ Starting webhook sync…"
nohup node scripts/webhookSync.js >/dev/null 2>&1 &

echo "→ Injecting test entropy (seed = 42)…"
node -e "require('./scripts/injectTorusAndSync').inject(42).then(()=>console.log('✅ Inject complete'))"

# 10) Run tests
echo "→ Running unit tests…"
npm test

echo "✅ Fix & full launch complete."
