#!/bin/bash
ARCHIVE="scrollchain-infra-2025-07-06.zip"
SCROLL="dao/proposals/register-cid.scroll"
LOG="ScrollChain-PinLog.md"
HTML="ScrollChain-PinLog.html"
NFT_STORAGE_API_KEY="6b216f12.3244a19773cb4ac792908eab0cb4c45c"

echo "📡 Uploading $ARCHIVE to NFT.Storage..."
RESPONSE=$(curl -s -X POST https://api.nft.storage/upload \
  -H "Authorization: Bearer $NFT_STORAGE_API_KEY" \
  -H "Content-Type: application/zip" \
  --data-binary @"$ARCHIVE")

CID=$(echo "$RESPONSE" | grep -o '"cid":"[^"]*' | sed 's/\"cid\":\"//')

if [ -z "$CID" ]; then
  echo "❌ Failed to retrieve CID from NFT.Storage."
  echo "📨 Response: $RESPONSE"
  exit 1
fi

echo "✅ Pinned with CID: $CID"

sed -i "s/^cid: .*/cid: $CID/" "$SCROLL"
echo "| $(date -u +%F) | $CID | $SCROLL | scrollchain-pin-and-publish.sh |" >> "$LOG"
sed -i "s/QmPlaceholderCID/$CID/g" "$HTML"

git add "$SCROLL" "$LOG" "$HTML"
git commit -m "📌 Pin CID $CID via NFT.Storage and update scroll + ledger"
git push origin main