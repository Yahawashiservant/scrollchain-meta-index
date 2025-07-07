#!/usr/bin/env bash
set -euo pipefail

echo "🚀 ScrollPlanet Full Launch on Replit"

# 1) Strip out any '#' comments so package.json is valid JSON
echo "→ Cleaning package.json of comments…"
grep -v '^[[:space:]]*#' package.json > pkg.tmp.json
mv pkg.tmp.json package.json

# 2) Inject parse-duration overrides if missing
if ! grep -q '"overrides"' package.json; then
  echo "→ Adding parse-duration overrides"
  sed -i '/"devDependencies"/a\
  ,\
  "overrides": {\
    "parse-duration": "^3.0.0",\
    "ipfs-core-utils/parse-duration": "^3.0.0"\
  }' package.json
fi

# 3) Install JS dependencies
echo "→ npm install"
npm install

# 4) Install & configure Supabase CLI
echo "→ Installing supabase CLI (if needed)…"
if ! command -v supabase &> /dev/null; then
  npm install -g supabase
fi

echo "→ Logging into Supabase"
supabase login --token "$SUPABASE_KEY"
echo "→ Linking Supabase project"
supabase link --project-ref "$SupaBase_Database_ID"

# 5) Push schema to Supabase
echo "→ Pushing SQL schema to Supabase"
supabase db push

# 6) Bootstrap & deploy contracts with Hardhat
echo "→ Setting up Hardhat in /contracts…"
pushd contracts >/dev/null

# ensure we have the right versions
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox ethers@^6.14.0 --legacy-peer-deps

# initialize if needed
if [ ! -f hardhat.config.js ]; then
  npx hardhat init --template minimal --force
fi

echo "→ Compiling contracts…"
npx hardhat compile

echo "→ Starting local Hardhat node in background…"
nohup npx hardhat node >/dev/null 2>&1 &

# give node a moment to start
sleep 5

echo "→ Deploying QDAO to localhost…"
npx hardhat run --network localhost scripts/deploy.js

popd >/dev/null

# 7) Start on-chain → off-chain sync
echo "→ Launching webhookSync…"
nohup node scripts/webhookSync.js >/dev/null 2>&1 &

# 8) Inject a sample entropy trail
echo "→ Injecting test seed=42…"
node -e "require('./scripts/injectTorusAndSync').inject(42).then(()=>console.log('⭐ Test inject complete'))"

echo "✅ Replit Full Launch complete. Your ScrollPlanet stack is live!"
