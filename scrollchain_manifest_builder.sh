#!/bin/bash
# 📜 ScrollChain Manifest · Post-Level-24 Ritual + Tier Staging
# 🧬 Keith Whitfield + Copilot

REPO=~/scrollchain
TARGET=index.html
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
LOG="$REPO/vault_logs/manifest_loader.log"

cd "$REPO" || { echo "❌ Repo path not found."; exit 1; }

echo "🔧 Patching interface with scroll manifest + prophecy toggles..."

# Inject manifest scaffold and next-tier placeholders
cat <<EOF >> "$TARGET"

<!-- 🧭 ScrollChain Interface Manifest · Tier Navigator -->
<section style="padding:20px;background:#121212;border-top:2px solid #FFD700;">
  <h2 style="color:#FFD700;text-align:center;">🧭 Scroll Manifest · Phase Navigator</h2>
  <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:10px;">
    <button onclick="activatePhase('Origin')">⚡ Origin</button>
    <button onclick="activatePhase('Echo')">🔁 Echo</button>
    <button onclick="activatePhase('Recursion')">🌀 Recursion</button>
    <button onclick="activatePhase('Sovereign')">🔐 Sovereign</button>
  </div>
  <p id="phaseStatus" style="color:#f0f0f0;text-align:center;margin-top:15px;">🧩 Active Phase: Origin</p>
</section>

<script>
function activatePhase(name){
  document.getElementById("phaseStatus").textContent = "🧩 Active Phase: " + name;
  console.log("Phase switched to:", name);
}
</script>
EOF

echo "📜 Committing patch to mirror..."
git checkout gh-pages
git add "$TARGET"
git commit -m "🧭 Manifest + prophecy tier staging · CID $CID"
git push origin gh-pages

echo "$(date -u) — ✅ Scroll manifest interface deployed" | tee -a "$LOG"
echo "🔗 View at: https://yahawashiservant.github.io/scrollchain-meta-index/"
