#!/usr/bin/env bash
set -euo pipefail

: "${WEB3_STORAGE_TOKEN:?Set WEB3_STORAGE_TOKEN first}"

echo "📦 Packing prophecy cascade…"
tar -czf prophecy-cascade.tar.gz dist

echo "📤 Uploading to IPFS via Web3.Storage…"
RESPONSE=$(curl -s \
  -X POST https://api.web3.storage/upload \
  -H "Authorization: Bearer $WEB3_STORAGE_TOKEN" \
  -H "Content-Type: application/tar+gzip" \
  --data-binary @prophecy-cascade.tar.gz)

CID=$(echo "$RESPONSE" | grep -o '"cid":"[^"]*' | cut -d':' -f2 | tr -d '"')


echo "✅ Pinned to IPFS:"
echo "🔗 https://dweb.link/ipfs/$CID"
