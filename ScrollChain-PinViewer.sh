#!/bin/bash

echo "🌐 Creating ScrollChain-PinViewer.html..."

mkdir -p viewer

cat <<EOF > viewer/ScrollChain-PinViewer.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>📌 ScrollChain Pin Viewer</title>
  <style>
    body {
      background: #0e0e0e;
      color: #00ffcc;
      font-family: 'Courier New', monospace;
      padding: 2rem;
    }
    h1 {
      color: #00ffff;
    }
    .pin {
      margin-bottom: 1.5rem;
      padding: 1rem;
      border: 1px solid #00ffaa;
      background: #1a1a1a;
    }
    .label {
      color: #88ffee;
    }
  </style>
</head>
<body>
  <h1>📌 ScrollChain Pin Viewer</h1>
  <div id="pins"></div>

  <script>
    fetch('../manifests/ScrollChain-PinManifest.json')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('pins');
        data.pins.forEach(pin => {
          const div = document.createElement('div');
          div.className = 'pin';
          div.innerHTML = \`
            <div><span class="label">📂 Type:</span> \${pin.type}</div>
            <div><span class="label">📝 Name:</span> \${pin.name}</div>
            <div><span class="label">🧬 CID:</span> \${pin.cid}</div>
            <div><span class="label">⏱ Timestamp:</span> \${pin.timestamp}</div>
            <div><span class="label">🌐 Gateway:</span> <a href="\${pin.gateway}" target="_blank">\${pin.gateway}</a></div>
            <div><span class="label">🔐 Sigil Hash:</span> \${pin.sigil_hash}</div>
          \`;
          container.appendChild(div);
        });
      });
  </script>
</body>
</html>
EOF

echo "✅ Pin viewer created at viewer/ScrollChain-PinViewer.html"
