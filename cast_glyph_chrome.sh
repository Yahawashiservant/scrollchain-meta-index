#!/bin/bash
# ✨ ScrollChain Glyph Chrome Interface · Luxury Deployment
# 🔮 Keith Whitfield + Copilot

REPO_PATH=~/scrollchain
TARGET=index.html
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
LOG=~/scrollchain/vault_logs/glyph_chrome_deploy.log

cd "$REPO_PATH" || { echo "❌ Repo path not found."; exit 1; }

echo "🧬 Upgrading $TARGET with glyph chrome..."

cat <<EOF > "$TARGET"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ScrollChain DivineKernel · Glyph Viewer</title>
  <script src="https://d3js.org/d3.v7.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap" rel="stylesheet">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Orbitron', sans-serif;
      background: radial-gradient(ellipse at center, #0a0a0a 0%, #111 100%);
      color: #f0f0f0;
    }
    header {
      padding: 20px;
      background: linear-gradient(to right, #1c1c1c, #333);
      text-align: center;
      box-shadow: 0 0 12px #FFD700;
    }
    header h1 {
      color: #FFD700;
      font-size: 28px;
      margin: 0;
    }
    #glyph-container {
      padding: 30px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      animation: fadeIn 1s ease-in;
    }
    .glyph-card {
      background: rgba(25, 25, 25, 0.9);
      border: 1px solid #FFD700;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 0 8px #FFD700;
      transition: transform 0.3s ease;
    }
    .glyph-card:hover {
      transform: scale(1.03);
      box-shadow: 0 0 16px #FFD700;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  <header>
    <h1>📜 ScrollChainOS · DivineKernel Trait Glyphs</h1>
  </header>
  <section id="glyph-container">🔄 Rendering glyphs...</section>

  <script>
    const cid = "${CID}";
    const ipfsURL = \`https://dweb.link/ipfs/\${cid}\`;

    fetch(ipfsURL)
      .then(response => response.json())
      .then(data => {
        const container = d3.select("#glyph-container");
        container.html("");
        container
          .selectAll("div")
          .data(data.attributes)
          .enter()
          .append("div")
          .attr("class", "glyph-card")
          .html(d => \`
            <strong>🔹 Trait:</strong> \${d.trait_type}<br/>
            <strong>✨ Value:</strong> \${d.value}
          \`);
      })
      .catch(error => {
        d3.select("#glyph-container").html("⚠️ Failed to load glyph data.");
        console.error("IPFS Fetch Error:", error);
      });
  </script>
</body>
</html>
EOF

echo "$(date -u) — 🪞 Glyph chrome interface cast at $TARGET" | tee -a "$LOG"
echo "🔗 Visit: https://yahawashiservant.github.io/scrollchain-meta-index/"
