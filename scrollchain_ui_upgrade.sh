#!/bin/bash
# 🌀 ScrollChain Interface Tier II · Multi-layer Glyph & DAO UI
# 🔮 Keith Whitfield + Copilot

REPO=~/scrollchain
TARGET=index.html
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
LOG="$REPO/vault_logs/ui_upgrade.log"

cd "$REPO" || exit 1

echo "🧬 Injecting multi-layer UI into $TARGET..."

cat <<EOF > "$TARGET"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ScrollChain Glyph Dashboard</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0; padding: 0;
      font-family: 'Orbitron', sans-serif;
      background: radial-gradient(ellipse at center, #0b0b0b, #111);
      color: #f4f4f4;
    }
    header, nav, footer {
      text-align: center;
      padding: 15px;
      background: linear-gradient(to right, #222, #333);
    }
    h1 { color: #FFD700; }
    #controls, #dao-panel {
      padding: 20px;
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }
    button, select {
      background: #222;
      color: #FFD700;
      border: 1px solid #FFD700;
      padding: 8px 14px;
      border-radius: 4px;
      cursor: pointer;
    }
    #glyphs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      padding: 30px;
    }
    .glyph {
      background: rgba(30,30,30,0.9);
      border: 1px solid #FFD700;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 0 8px #FFD700;
      transition: transform 0.3s ease;
    }
    .glyph:hover {
      transform: scale(1.03);
      box-shadow: 0 0 16px #FFD700;
    }
    canvas {
      width: 100%;
      height: 240px;
      background: #000;
      display: block;
    }
  </style>
</head>
<body>
  <header><h1>📜 ScrollChainOS · DivineKernel Interface</h1></header>

  <nav id="controls">
    <label>🔁 CID Switch:</label>
    <input type="text" id="cidInput" value="${CID}" />
    <button onclick="loadCID()">Load</button>

    <label>🧬 Trait Filter:</label>
    <select id="traitFilter">
      <option value="all">All</option>
    </select>
  </nav>

  <section id="glyphs">🔄 Loading traits...</section>

  <section id="dao-panel">
    <div>
      <h3>🗳️ DAO Action</h3>
      <button onclick="alert('Vote cast for Prophecy Path A')">Path A</button>
      <button onclick="alert('Vote cast for Entropy Sync B')">Path B</button>
      <a href="https://earthhub.tv" target="_blank">🌎 Visit EarthHub.tv</a>
    </div>
  </section>

  <canvas id="entropyCanvas"></canvas>

  <footer>🔐 ENS: <code>scrollchain.eth</code> mirror pending</footer>

  <script>
    const canvas = document.getElementById("entropyCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = 240;

    let orbitals = Array.from({length: 50}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: Math.random() * 2 - 1,
      dy: Math.random() * 2 - 1
    }));

    function animateEntropy() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbitals.forEach(o => {
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
        ctx.fillStyle = "#FFD700";
        ctx.fill();
        o.x += o.dx;
        o.y += o.dy;
        if (o.x < 0 || o.x > canvas.width) o.dx *= -1;
        if (o.y < 0 || o.y > canvas.height) o.dy *= -1;
      });
      requestAnimationFrame(animateEntropy);
    }
    animateEntropy();

    function loadCID() {
      const cid = document.getElementById("cidInput").value.trim();
      fetch(\`https://dweb.link/ipfs/\${cid}\`)
        .then(res => res.json())
        .then(data => {
          const glyphs = document.getElementById("glyphs");
          glyphs.innerHTML = "";
          const traits = data.attributes;
          const filterSet = new Set();
          traits.forEach(attr => filterSet.add(attr.trait_type));
          const filterSelect = document.getElementById("traitFilter");
          filterSelect.innerHTML = '<option value="all">All</option>';
          filterSet.forEach(trait => {
            const opt = document.createElement("option");
            opt.value = trait;
            opt.text = trait;
            filterSelect.appendChild(opt);
          });

          filterSelect.onchange = () => {
            renderTraits(traits, filterSelect.value);
          };
          renderTraits(traits, "all");
        });
    }

    function renderTraits(traits, filter) {
      const glyphs = document.getElementById("glyphs");
      glyphs.innerHTML = "";
      traits.filter(t => filter === "all" || t.trait_type === filter)
        .forEach(t => {
          const div = document.createElement("div");
          div.className = "glyph";
          div.innerHTML = \`<strong>Trait:</strong> \${t.trait_type}<br/><strong>Value:</strong> \${t.value}\`;
          glyphs.appendChild(div);
        });
    }

    window.onload = loadCID;
  </script>
</body>
</html>
EOF

echo "$(date -u) — 🧠 Multi-layer UI injected into $TARGET" | tee -a "$LOG"
echo "🔗 Reload page: https://yahawashiservant.github.io/scrollchain-meta-index/"
