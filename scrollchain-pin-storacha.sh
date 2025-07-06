#!/bin/bash

CID="bafybeigoidrqxxryjamc7pz6jkgfjr33qvlcigadqhzci4mteza4elih74"
SCROLL="dao/proposals/register-cid.scroll"
LOG="ScrollChain-PinLog.md"
HTML="ScrollChain-PinLog.html"
DATE=$(date -u +%F)

echo "📜 Updating scroll with CID..."
sed -i "s/^cid: .*/cid: $CID/" "$SCROLL"

echo "🧾 Appending to Markdown ledger..."
echo "| $DATE | $CID | $SCROLL | Storacha Console |" >> "$LOG"

echo "🌐 Updating HTML ledger..."
sed -i "s/QmPlaceholderCID/$CID/g" "$HTML"

echo "📤 Committing and pushing to GitHub..."
git add "$SCROLL" "$LOG" "$HTML"
git commit -m "📌 Pin CID $CID via Storacha and update scroll + ledger"
git push origin main

echo "✅ Done. CID $CID is now published and logged."
echo "🌍 Gateway: https://ipfs.io/ipfs/$CID"
echo "🌐 ENS (if configured): https://scrollchain.eth.limo/ipfs/$CID"
