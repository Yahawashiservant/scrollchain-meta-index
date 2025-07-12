#!/usr/bin/env bash
echo "🔗 Launching Replit↔Ubuntu Codex Sync Bridge..."

# === 1. Set GitHub → Replit Sync Path ===
REPO_PATH="$HOME/scroll_final/scrollchain-meta-index"
REPLIT_GIT_URL="https://github.com/Yahawashiservant/scrollchain-meta-index.git"

# === 2. Pull Latest from Replit-Connected Repo ===
echo "📥 Pulling latest from Replit-connected repo..."
cd "$REPO_PATH"
git pull origin main

# === 3. Push Local Changes to Replit ===
echo "📤 Pushing local scroll changes to Replit..."
git add .
git commit -m "🔄 Synced local Ubuntu scrolls into Replit"
git push origin main

# === 4. Ping Replit Web Preview (optional) ===
REPLIT_PREVIEW_URL="https://scrollchain-meta-index.keith.repl.co"
echo "🌐 Pinging Replit interface..."
curl -s "$REPLIT_PREVIEW_URL" | head -n 10

# === 5. Confirm CID Map + Vault Routes ===
echo "📍 Test these from browser:"
echo "$REPLIT_PREVIEW_URL/codex-cid-map"
echo "$REPLIT_PREVIEW_URL/codex-vault"
echo "$REPLIT_PREVIEW_URL/codex-cloud-dashboard"
echo "$REPLIT_PREVIEW_URL/codex-observatory"

echo "✅ Sync complete. Sovereignty flows between Ubuntu + Replit."
