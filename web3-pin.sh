# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash
# web3-pin.sh — Upload .zip to Web3.Storage and update scroll with CID

ARCHIVE="scrollchain-infra-$(date +%F).zip"
SCROLL="dao/proposals/register-cid.scroll"

# Check for archive
if [ ! -f "$ARCHIVE" ]; then
  echo "❌ Archive $ARCHIVE not found. Run scrollchain-deploy.sh first."
  exit 1
fi

# Upload to Web3.Storage
echo "📡 Uploading $ARCHIVE to Web3.Storage..."
CID=$(curl -s -X POST https://api.web3.storage/upload \
  -H "Authorization: Bearer $Web3Storage_API_Token" \
  -H "Content-Type: application/zip" \
  --data-binary @"$ARCHIVE" | jq -r '.cid')

if [ -z "$CID" ] || [ "$CID" == "null" ]; then
  echo "❌ Failed to retrieve CID from Web3.Storage."
  exit 1
fi

echo "✅ Pinned to Web3.Storage with CID: $CID"

# Update scroll with new CID
sed -i "s/^cid: .*/cid: $CID/" "$SCROLL"
echo "📝 Updated $SCROLL with CID: $CID"

# Commit and push
git add "$SCROLL"
git commit -m "🔗 Update scroll with pinned CID: $CID" || echo "No changes"
git push origin main