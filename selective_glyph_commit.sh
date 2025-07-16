#!/bin/bash
# 🌀 ScrollChain Selective Glyph Commit · CID-bound Mirror Push
# 🔮 Keith Whitfield + Copilot

REPO=~/scrollchain
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
GH_BRANCH="gh-pages"
LOG="$REPO/vault_logs/selective_commit.log"

cd "$REPO" || { echo "❌ Repo not found."; exit 1; }

echo "🧊 Injecting CID into index.html..."
sed -i "s|const cid = \".*\";|const cid = \"$CID\";|" index.html

echo "🛡️ Applying .gitignore shield..."
cat <<EOF > .gitignore
# Ignore system scripts and bundles
dual_channel_deployer.sh
final_glyph_push.sh
*.tar.gz
vault_logs/
tools/
divinekernel_deploy_verify.sh
kernel_bundle/
scrollchain_divinekernel_setup.sh
EOF

echo "🎯 Staging selected glyph files..."
git add index.html ScrollChain-ProphecyViewer.html dashboard/

echo "📜 Committing with CID context..."
git commit -m "🧬 Glyph sync · CID $CID · Dashboard update"

echo "🚀 Pushing to branch: $GH_BRANCH"
git push origin "$GH_BRANCH"

echo "$(date -u) — ✅ Selective glyph push complete" | tee -a "$LOG"
echo "🔗 Live page: https://yahawashiservant.github.io/scrollchain-meta-index/" | tee -a "$LOG"
