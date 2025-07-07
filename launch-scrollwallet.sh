#!/usr/bin/env bash
set -euo pipefail

echo "🌐 Launching ScrollPlanet Smart Wallets App"

# 1. Inject environment variables (redacting .env issues)
export NEXT_PUBLIC_ALCHEMY_API_KEY="VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9"
export NEXT_PUBLIC_ALCHEMY_POLICY_ID="6ecc9265-7b21-4f53-a922-745c6cf42efb"

# 2. Navigate to app directory
cd my-smart-wallets-app

# 3. Install dependencies
echo "→ Installing dependencies"
npm install

# 4. Build the app
echo "→ Building app for production"
npm run build

# 5. Launch the app locally
echo "→ Starting app on http://localhost:3000"
npm run start
