#!/bin/bash
# 🌀 ScrollChain Governance Rituals UI · Symbolic Voting Overlay
# 🔮 Keith Whitfield + Copilot

REPO=~/scrollchain
TARGET=index.html
LOG="$REPO/vault_logs/governance_overlay.log"

cd "$REPO" || exit 1
echo "🔧 Injecting governance rituals into viewer..."

cat <<EOF >> "$TARGET"

<!-- 🔮 Governance Ritual Overlay -->
<section id="ritual-overlay" style="padding:30px;background:#111;border-top:2px solid #FFD700;">
  <h2 style="color:#FFD700;text-align:center;">🗳️ ScrollChain Governance · Party Channels</h2>
  <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-top:20px;">
    <button onclick="castVote('EarthHub.tv')">🌎 Earth-Hub</button>
    <button onclick="castVote('Kernel Custodians')">🧠 Kernel-Custodians</button>
    <button onclick="castVote('Entropy Speakers')">🌌 Entropy-Speakers</button>
    <button onclick="castVote('Guild of Foresight')">🔮 Guild of Foresight</button>
    <button onclick="castVote('Party for the Planet')">🌿 Party for the Planet</button>
  </div>
  <p id="voteLog" style="text-align:center;color:#f0f0f0;margin-top:20px;">No vote cast yet.</p>
</section>

<script>
function castVote(channel) {
  document.getElementById("voteLog").innerText = "🗳️ Vote cast for " + channel + ". Scroll bonding initiated.";
  console.log("ScrollChain vote:", channel);
}
</script>

EOF

echo "$(date -u) — 🗳️ Governance overlay injected into $TARGET" | tee -a "$LOG"
echo "🔗 Reload after push: https://yahawashiservant.github.io/scrollchain-meta-index/"
