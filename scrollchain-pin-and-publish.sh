#!/bin/bash
ARCHIVE="scrollchain-infra-2025-07-06.zip"
SCROLL="dao/proposals/register-cid.scroll"
LOG="ScrollChain-PinLog.md"
HTML="ScrollChain-PinLog.html"

# Upload to Web3.Storage
echo "📡 Uploading $ARCHIVE to Web3.Storage..."
RESPONSE=$(curl -s -X POST https://api.web3.storage/upload \
  -H "Authorization: Bearer $Web3Storage_API_Token" \
  -H "Content-Type: application/zip" \
  --data-binary @"$ARCHIVE")

CID=$(echo "$RESPONSE" | grep -o '"cid":"[^"]*' | sed 's/"cid":"//')

if [ -z "$CID" ]; then
  echo "❌ Failed to retrieve CID."
  exit 1
fi

echo "✅ Pinned with CID: $CID"

# Update scroll
sed -i "s/^cid: .*/cid: $CID/" "$SCROLL"

# Append to Markdown log
echo "| $(date -u +%F) | $CID | $SCROLL | scrollchain-pin-and-publish.sh |" >> "$LOG"

# Update HTML ledger
sed -i "s/QmPlaceholderCID/$CID/g" "$HTML"

# Commit and push
git add "$SCROLL" "$LOG" "$HTML"
git commit -m "📌 Pin CID $CID and update scroll + ledger"
git push origin main
