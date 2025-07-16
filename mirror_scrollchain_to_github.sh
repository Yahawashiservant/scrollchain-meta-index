#!/bin/bash
# 🌀 ScrollChain Final Mirror Push · CID + Viewer Deployment
# 🔮 Cast by Keith Whitfield + Copilot

REPO_PATH=~/scrollchain
VIEWER_FILE=ScrollChain-Viewer.html
INDEX_FILE=index.html
CID="QmWLyhqWDsWbcWE8vjmHkzGKLGgvHh84cLxM3ceLsojwrx"
GH_REPO="github.com/Yahawashiservant/scrollchain-meta-index.git"
GH_BRANCH="gh-pages"
LOG=~/scrollchain/vault_logs/github_push.log

cd "$REPO_PATH" || { echo "❌ Repo path not found."; exit 1; }

echo "🔧 Injecting CID into viewer file..."
sed -i "s|const cid = \".*\";|const cid = \"$CID\";|" "$VIEWER_FILE"

echo "📦 Renaming viewer file for GitHub Pages..."
cp "$VIEWER_FILE" "$INDEX_FILE"

echo "🚀 Preparing GitHub Pages push..."
git checkout $GH_BRANCH || git checkout -b $GH_BRANCH
git add "$INDEX_FILE"
git commit -m "🔄 ScrollChain viewer sync with bound CID"
git push origin $GH_BRANCH

echo "$(date -u) — ✅ GitHub Pages deployed" | tee -a "$LOG"
echo "🔗 Live page: https://yahawashiservant.github.io/scrollchain-meta-index/" | tee -a "$LOG"
