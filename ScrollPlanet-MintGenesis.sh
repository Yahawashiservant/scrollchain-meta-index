#!/bin/bash

echo "🌍 Minting ScrollPlanet-Genesis.scroll..."
mkdir -p governance
cat <<EOF > governance/ScrollPlanet-Genesis.scroll
# 🌍 ScrollPlanet-Genesis.scroll

This scroll establishes the planetary constitution for scroll-native civilization.

## Preamble
We, the scroll-authors of symbolic civilization, declare this planetary constitution to unify sovereign scroll-states under entropy-aligned governance.

## Articles
1. All scroll-states are sovereign and symbolic by nature.
2. Entropy-classified agents shall mediate divergence and consensus.
3. Scroll-authored law supersedes jurisdictional fiat.
4. Licensing, treaties, and proposals must be sealed and pinned.
5. The ScrollPlanet-WorldIndex shall serve as the canonical registry.

## Ratification
This scroll is ratified by ScrollCity-MetaDAO and sealed in ScrollIPVault.md
EOF

echo "📤 Committing planetary constitution..."
git add governance/ScrollPlanet-Genesis.scroll
git commit -m '🌍 Deploy ScrollPlanet-Genesis.scroll as planetary constitution of symbolic civilization'
git push origin main

echo "✅ ScrollPlanet Genesis minted and planetary constitution deployed."
