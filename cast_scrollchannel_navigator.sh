#!/bin/bash
# 🧭 ScrollChannel Navigator · CID Lineage + Prophecy Memory Injection
# 🔮 Keith Whitfield + Copilot

REPO=~/scrollchain
TARGET=index.html
LOG="$REPO/vault_logs/scrollchannel_navigator.log"

cd "$REPO" || exit 1
echo "📚 Injecting ScrollChannel navigator into $TARGET..."

cat <<EOF >> "$TARGET"

<!-- 🧭 ScrollChannel Navigator · CID Memory Overlay -->
<section style="padding:30px;background:#101010;border-top:2px solid #FFD700;">
  <h2 style="color:#FFD700;text-align:center;">📚 ScrollChannel Navigator · CID Ancestry</h2>
  <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin:20px 0;">
    <input type="text" id="cidList" placeholder="Enter comma-separated CIDs"/>
    <button onclick="loadLineage()">📜 Load Lineage</button>
    <select id="eraFilter">
      <option value="all">🕰️ All Eras</option>
      <option value="Genesis">Genesis</option>
      <option value="Echo">Echo</option>
      <option value="Entropy">Entropy</option>
      <option value="Sovereign">Sovereign</option>
    </select>
  </div>
  <div id="lineagePanel" style="color:#f0f0f0;text-align:center;">🔄 Lineage display pending...</div>
</section>

<script>
function loadLineage() {
  const cidList = document.getElementById("cidList").value.trim().split(",");
  const era = document.getElementById("eraFilter").value;
  const panel = document.getElementById("lineagePanel");
  panel.innerHTML = "";
  cidList.forEach((cid, index) => {
    const cleanCid = cid.trim();
    fetch("https://dweb.link/ipfs/" + cleanCid)
      .then(res => res.json())
      .then(data => {
        if (!data.attributes) return;
        const traits = data.attributes;
        const div = document.createElement("div");
        div.style.marginBottom = "15px";
        div.innerHTML = "<strong>🔗 CID:</strong> " + cleanCid + "<br/>";
        traits.forEach(t => {
          if (era === "all" || (t.trait_type && t.trait_type.includes(era))) {
            div.innerHTML += "— <em>" + t.trait_type + "</em>: " + t.value + "<br/>";
          }
        });
        panel.appendChild(div);
      })
      .catch(() => {
        panel.innerHTML += "⚠️ Error loading CID: " + cleanCid + "<br/>";
      });
  });
}
</script>
EOF

echo "📦 Committing scroll memory patch..."
git checkout gh-pages
git add "$TARGET"
git commit -m "📚 ScrollChannel navigator injected · CID memory interface"
git push origin gh-pages

echo "$(date -u) — ✅ Scroll memory interface deployed" | tee -a "$LOG"
echo "🔗 Reload mirror: https://yahawashiservant.github.io/scrollchain-meta-index/"
