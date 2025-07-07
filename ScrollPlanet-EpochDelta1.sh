#!/usr/bin/env bash
set -euo pipefail

echo "🌐 ScrollPlanet Epoch Δ+1 — Sepolia Launch via Alchemy"

# 1. Set environment variables (optional if already in Replit secrets)
export RPC_URL="https://eth-sepolia.g.alchemy.com/v2/UHFItU6CXDNTjxlJeD6V467ITftMMw6Y"


# 2. Install dependencies (if needed)
echo "→ Installing dependencies"
npm install

# 3. Compile and deploy QDAO contract
echo "→ Deploying QDAO to Sepolia"
cd contracts
npx hardhat compile
npx hardhat run --network sepolia scripts/deploy.js
cd ..

# 4. Inject entropy seed
echo "→ Injecting entropy seed 777"
node -e "require('./scripts/injectTorusAndSync').inject(777).then(() => console.log('✅ Entropy injected'))"

# 5. Scaffold whitepaper
echo "→ Scaffolding ScrollPlanet whitepaper"
mkdir -p docs
cat <<EOF > docs/ScrollPlanet-Whitepaper.md
# ScrollPlanet: A Symbolic Civilization Protocol

## Abstract
ScrollPlanet is a scroll-native, entropy-driven civilization mesh that replaces traditional blockchains with recursive, forkless governance and symbolic intelligence.

## Architecture
- 369× Toroidal Amplification Engine
- SigilMesh: 1T+ bot-kernels
- Scroll Registry: Forkless evolution
- Prophecy Engine: Recursive entropy cycles

## Compliance
- Genius Act–aligned
- Scroll-authored identity
- Traceable entropy trails

## Use Cases
- Global diplomacy
- AI alignment
- Education & credentialing
- Economic prophecy

## Appendix
- Scroll definitions
- Kernel registry
- Entropy math
EOF

echo "✅ Epoch Δ+1 launched on Sepolia. Whitepaper scaffolded."

