#!/usr/bin/env bash
echo "🗂️ Forging CodexSync Manifest + Sync Engine across Yahawashiservant repositories..."

MANIFEST="ScrollChain_Deployment_Ledger.md"
SYNC_SCRIPT="CodexRegistrySync.sh"

# === 1. Create Manifest Ledger ===
cat <<EOF > $MANIFEST
# 📜 ScrollChain Codex — Deployment Ledger (Last 48h)

## 🔺 Arc Radius System
- **ArcRadius.ts**
- **DivineEquations.ts**
- **NeuralKernel.ts**
- **NFTShapeEngine.ts**

## 🧬 Pisano Mint Engine
- **PisanoMintEngine.ts**
- Deployed via: forge_pisano_mint_engine_scroll.sh

## 💻 UI Views & Routes
- ScrollEntropyStream.tsx → /scroll-entropy-stream
- ScrollBotRegistry.tsx → /scrollbot-registry
- ScrollHealthCheck.tsx → /scroll-health-check
- CodexRouterMap.tsx → /codex-router-map
- bannerConfig.json → UI symbol config

## 🧠 Unified API
- Server.ts (port 3690)
- Routes: /api/codex/entropy, /mint, /geometry
- Engines: ArcRadiusEngine.ts

## 🗃️ Scroll Scripts Executed
- forge_scrollbot_registry_view.sh
- forge_scroll_health_dashboard.sh
- forge_router_map_scroll.sh
- wire_scrollchain_codex.sh

## 🧭 Legal / Jurisdiction
- Canada (PIPEDA)
- EU (GDPR + eIDAS)
- USA (ESIGN / UETA)
EOF
echo "✅ Manifest Ledger created: $MANIFEST"

# === 2. Create Sync Script ===
cat <<EOF > $SYNC_SCRIPT
#!/usr/bin/env bash
echo "🔗 Syncing ScrollChain Codex changes to Yahawashiservant repositories..."

REPOS=("scrollchain-infinity-ui" "ScrollChainArcRadius" "ScrollChainCodexAPI")

for repo in "\${REPOS[@]}"; do
  if [ -d "\$HOME/repos/Yahawashiservant/\$repo" ]; then
    cd "\$HOME/repos/Yahawashiservant/\$repo"
    echo "🔄 Syncing: \$repo"
    git add .
    git commit -m "CodexSync — auto-sync update [$(date)]"
    git push origin main
  else
    echo "⚠️ Repo not found: \$repo"
  fi
done
EOF

chmod +x $SYNC_SCRIPT
echo "✅ Sync Script created: $SYNC_SCRIPT"

echo "🌀 Execute './$SYNC_SCRIPT' to push all changes across repos"
