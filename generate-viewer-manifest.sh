# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash

CAR_FILE="ScrollChain-Viewer.car"
CID="bafybeidpbblkvjhqdkruxdgizktrgvx7eb6ruhdd242fiokaa5ijcnnmj4"

echo "🧠 Generating ScrollChain-ViewerManifest.json with CID: $CID"

# 1. Create viewer manifest
cat <<EOF > ScrollChain-ViewerManifest.json
{
  "viewer": "ScrollChain-Viewer.html",
  "index": "ScrollChain-Index.html",
  "mint_log": "ScrollChain-MintLog.md",
  "sigil_registry": "ScrollChain-SigilRegistry.scroll",
  "release_manifest": "ScrollChain-ReleaseManifest.json",
  "car_file": "$CAR_FILE",
  "cid": "$CID",
  "ipfs_gateway": "https://ipfs.io/ipfs/$CID",
  "ens_gateway": "https://scrollchain.eth.limo"
}
EOF

echo "✅ Viewer manifest created."

# 2. Embed into ScrollChain-Index.html
echo "🧩 Embedding viewer manifest link into ScrollChain-Index.html..."
sed -i '/<\/body>/i \
  <div class="section">\n\
    <h2>📦 Viewer Manifest</h2>\n\
    <ul>\n\
      <li><a href="ScrollChain-ViewerManifest.json" target="_blank">View Viewer Manifest (JSON)</a></li>\n\
    </ul>\n\
  </div>' ScrollChain-Index.html

# 3. Append to MintLog
echo "📜 Appending to ScrollChain-MintLog.md..."
echo -e "\n| 2025-07-06 | ScrollChain-ViewerManifest.json | viewer.manifest | $CID |" >> ScrollChain-MintLog.md

# 4. Commit and push
echo "📤 Committing and pushing to GitHub..."
git add ScrollChain-ViewerManifest.json ScrollChain-Index.html ScrollChain-MintLog.md
git commit -m "📦 Add ScrollChain-ViewerManifest.json and embed in index + mint log"
git push origin main

echo "🌀 Viewer manifest published and embedded."

