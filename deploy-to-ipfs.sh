#!/usr/bin/env bash
set -euo pipefail

# Your Web3.Storage token
WEB3_TOKEN="6b216f12.3244a19773cb4ac792908eab0cb4c45c"

echo "🛠 Preparing viewer..."
mkdir -p prophecy-viewer
cat > prophecy-viewer/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
  <title>📜 ScrollPlanet Prophecies</title>
  <script src="https://cdn.jsdelivr.net/npm/ethers@6.7.0/dist/ethers.umd.min.js"></script>
</head>
<body>
  <h1>📜 Prophecy Scroll</h1>
  <ul id="prophecies"></ul>
  <script>
    const provider = new ethers.JsonRpcProvider("https://sepolia-rpc.scroll.io");
    const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";
    const abi = [
      "event ProphecySubmitted(address indexed prophet, string message, uint256 timestamp)"
    ];
    const contract = new ethers.Contract(contractAddress, abi, provider);
    const ul = document.getElementById("prophecies");
    async function loadProphecies() {
      const events = await contract.queryFilter("ProphecySubmitted");
      events.reverse().forEach(e => {
        const li = document.createElement("li");
        li.textContent = \`\${e.args.prophet}: "\${e.args.message}" @ \${new Date(e.args.timestamp * 1000).toLocaleString()}\`;
        ul.appendChild(li);
      });
    }
    loadProphecies();
  </script>
</body>
</html>
EOF

echo "📦 Installing web3.storage CLI..."
npm install -g web3.storage

echo "📤 Uploading to IPFS..."
CID=$(web3.storage put prophecy-viewer/ --token="$WEB3_TOKEN" --wrap-with-directory)

echo "✅ Deployed to IPFS!"
echo "🔗 https://ipfs.io/ipfs/$CID"

