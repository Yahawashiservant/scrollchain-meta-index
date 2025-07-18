#!/bin/bash
# 🌀 ScrollChainOS Dashboard Launcher · Viewer + API Routing

echo "🚀 Launching ScrollChainOS Dashboard..."

# 1. Ensure viewer directory exists
mkdir -p public/viewer

# 2. Create ScrollPlanet Registry Viewer (if missing)
if [ ! -f public/viewer/ScrollPlanet-RegistryViewer.html ]; then
  echo "🧬 Creating ScrollPlanet Registry Viewer..."
  cat <<EOF > public/viewer/ScrollPlanet-RegistryViewer.html
<!DOCTYPE html>
<html>
<head>
  <title>ScrollPlanet Registry Viewer</title>
  <meta charset="UTF-8" />
  <style>
    body { font-family: monospace; background: #111; color: #0f0; padding: 2em; }
    h1 { color: #fff; }
    pre { white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <h1>🌀 ScrollPlanet Registry Viewer</h1>
  <pre id="registry"></pre>
  <script>
    fetch('/api/registry')
      .then(res => res.text())
      .then(data => {
        document.getElementById('registry').textContent = data;
      });
  </script>
</body>
</html>
EOF
fi

# 3. Create dashboard-api.js (if missing)
if [ ! -f server/dashboard-api.js ]; then
  echo "📡 Creating dashboard API router..."
  mkdir -p server
  cat <<EOF > server/dashboard-api.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/scrolls', (req, res) => {
  const file = path.join(__dirname, '../minted_kernels/kernel_registry.csv');
  res.sendFile(file);
});

router.get('/agents', (req, res) => {
  const agents = [
    { name: 'WealthAgent', id: 'WA-001' },
    { name: 'QuantumTrader', id: 'QT-002' },
    { name: 'ComplianceBot', id: 'CB-003' },
    { name: 'GovernanceOracle', id: 'GO-004' }
  ];
  res.json(agents);
});

router.get('/registry', (req, res) => {
  const file = path.join(__dirname, '../ScrollChain-MintLog.md');
  res.sendFile(file);
});

module.exports = router;
EOF
fi

# 4. Confirm deployment-ready.js includes routing
echo "🧠 Confirming server routing..."
grep "dashboardAPI" server/deployment-ready.js || echo "⚠️ Add 'const dashboardAPI = require(\"./dashboard-api\")' and 'app.use(\"/api\", dashboardAPI)' to deployment-ready.js"

# 5. Restart server
echo "🔁 Restarting server..."
killall node
node server/deployment-ready.js &

echo "✅ ScrollChainOS dashboard launched."
echo "🌐 Viewer: /viewer/ScrollPlanet-RegistryViewer.html"
echo "📡 API: /api/scrolls, /api/agents, /api/registry"
