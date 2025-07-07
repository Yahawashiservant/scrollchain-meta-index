#!/usr/bin/env bash
set -euo pipefail

# Your Web3.Storage token
WEB3_TOKEN="6b216f12.3244a19773cb4ac792908eab0cb4c45c"

echo "🛠 Building Vite app..."
npm run build

echo "📦 Installing web3.storage CLI..."
npm install -g web3.storage

echo "🔐 Setting token..."
export WEB3_STORAGE_TOKEN="$WEB3_TOKEN"

echo "📤 Uploading dist/ to IPFS..."
CID=$(web3.storage put dist/ --wrap-with-directory)

echo "✅ Deployed to IPFS!"
echo "🔗 https://ipfs.io/ipfs/$CID"
