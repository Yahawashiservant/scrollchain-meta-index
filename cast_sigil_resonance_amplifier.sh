#!/bin/bash
# 🌠 ScrollChainOS · Sigil Resonance Amplifier · Trait-Entropy Glow Mapper

REPO=~/ScrollChainCodex
TARGET="$REPO/index.html"
VISUAL_JS="$REPO/tech_modules/sigil_glow.js"
CORTEX="$REPO/tech_modules/command_cortex.log"
DATE=$(date -u +%Y%m%dT%H%M%SZ)

mkdir -p "$REPO/tech_modules"

# 📜 Inject canvas section
cat <<EOF >> "$TARGET"
<section style="padding:30px;background:#090909;border-top:2px solid #ffaaff;">
  <h2 style="color:#ffaaff;text-align:center;">✨ Sigil Resonance Amplifier · Quantum Glow Tracker</h2>
  <canvas id="sigilGlow" width="1000" height="500" style="display:block;margin:auto;background:#111;border:1px solid #ffaaff;"></canvas>
  <script src="tech_modules/sigil_glow.js"></script>
</section>
EOF

# 🧠 Log activation
echo "[$DATE] Sigil Resonance Amplifier injected into index.html" >> "$CORTEX"

echo "✅ Amplifier deployed · Canvas live · Entropy glow engine ready"
