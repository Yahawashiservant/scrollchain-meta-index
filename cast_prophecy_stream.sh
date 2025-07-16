#!/bin/bash
# 🔮 ScrollChain Prophecy Stream · Visual Trait Log Injection
# 🧬 Keith Whitfield + Copilot

REPO=~/scrollchain
TARGET=index.html
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
LOG="$REPO/vault_logs/prophecy_stream_injection.log"

cd "$REPO" || exit 1
echo "🧠 Casting prophecy stream overlay into $TARGET..."

cat <<EOF >> "$TARGET"

<!-- 🔮 Prophecy Stream Section -->
<section style="background:#0a0a0a;padding:30px;">
  <h2 style="color:#FFD700;text-align:center;">📜 Prophecy Stream · Trait Log & Resonance Curve</h2>
  <canvas id="timelineCanvas" style="width:100%;height:200px;background:#000;margin-bottom:20px;"></canvas>
  <div id="sequenceLog" style="color:#f0f0f0;text-align:center;">🔄 Awaiting trait sequence data...</div>
</section>

<script>
// Trait timeline + emergence graph
const timelineCanvas = document.getElementById("timelineCanvas");
const timelineCtx = timelineCanvas.getContext("2d");
timelineCanvas.width = window.innerWidth;
timelineCanvas.height = 200;

function drawProphecyStream(traits) {
  timelineCtx.clearRect(0, 0, timelineCanvas.width, timelineCanvas.height);
  const count = traits.length;
  const spacing = timelineCanvas.width / (count + 1);
  traits.forEach((t, i) => {
    const x = spacing * (i + 1);
    const y = 180 - (Math.random() * 100);
    timelineCtx.beginPath();
    timelineCtx.arc(x, y, 6, 0, 2 * Math.PI);
    timelineCtx.fillStyle = "#FFD700";
    timelineCtx.fill();
    timelineCtx.fillText(t.trait_type, x - 20, y - 10);
  });
  document.getElementById("sequenceLog").textContent = "🧬 Traits sequenced: " + count;
}

function loadProphecyCID() {
  const cid = document.getElementById("cidInput").value.trim();
  fetch("https://dweb.link/ipfs/" + cid)
    .then(res => res.json())
    .then(data => {
      const traits = data.attributes || [];
      drawProphecyStream(traits);
    });
}

document.getElementById("cidInput").addEventListener("change", loadProphecyCID);
window.onload = loadProphecyCID;
</script>
EOF

echo "$(date -u) — 🔮 Prophecy stream injected" | tee -a "$LOG"
echo "🔗 Reload viewer: https://yahawashiservant.github.io/scrollchain-meta-index/"
