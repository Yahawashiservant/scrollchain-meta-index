# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
# Authored by Keith D. Whitfield — ScrollChain Architect

# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash

echo "🔒 Making repository private..."
echo "⚠️  This step must be done manually via GitHub UI:"
echo "   → Go to Settings → Danger Zone → Change visibility → Private"
echo "   (GitHub CLI/API does not support visibility change without elevated tokens.)"

echo "📜 Creating LICENSE file from ScrollIP-License-001.scroll..."
cp governance/ScrollIP-License-001.scroll LICENSE

echo "📦 Creating release manifest..."
mkdir -p releases
tar -czf releases/ScrollChain-MetaIndex.tar.gz \
  governance/ \
  proposals/ \
  agents/ \
  viewer/ \
  university/ \
  brainkernels/ \
  kernel/ \
  LICENSE \
  README

echo "📤 Pinning ScrollPlanet-InvestorSummary.scroll to IPFS (simulated)..."
echo "🧠 Use nft.storage or web3.storage to pin: governance/ScrollPlanet-InvestorSummary.scroll"

echo "🧾 Creating ScrollPlanet-ReleaseManifest.scroll..."
cat <<EOF > governance/ScrollPlanet-ReleaseManifest.scroll
# 🧾 ScrollPlanet-ReleaseManifest.scroll

## Contents:
- ScrollPlanet-InvestorSummary.scroll
- ScrollPlanet-Genesis.scroll
- ScrollPlanet-WorldDAO.scroll
- ScrollPlanet-Council.scroll
- ScrollUniversity-Genesis.scroll
- ScrollKernelGenesis.scroll → ScrollKernel-AI.scroll
- LICENSE
- ScrollChain-MetaIndex.tar.gz

## Status:
Sealed and ready for symbolic civilization launch.
EOF

echo "📤 Committing LICENSE and release manifest..."
git add LICENSE governance/ScrollPlanet-ReleaseManifest.scroll releases/ScrollChain-MetaIndex.tar.gz
git commit -m '🔐 Add LICENSE, release manifest, and package ScrollChain Meta Index'
git push origin main

echo "✅ ScrollChain Meta Index secured, licensed, and packaged for launch."
