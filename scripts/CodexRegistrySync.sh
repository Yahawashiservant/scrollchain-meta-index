#!/usr/bin/env bash
echo "🔗 Syncing ScrollChain Codex changes to Yahawashiservant repositories..."

  REPOS=(
  "/home/keith/scroll_final/scrollchain-infinity-ui"
  "/home/keith/scroll_final/ScrollChainArcRadius"
  "/home/keith/scroll_final/ScrollChainCodexAPI"
)


for repo in "${REPOS[@]}"; do
  if [ -d "$HOME/repos/Yahawashiservant/$repo" ]; then
    cd "$HOME/repos/Yahawashiservant/$repo"
    echo "🔄 Syncing: $repo"
    git add .
    git commit -m "CodexSync — auto-sync update [Sat Jul 12 02:23:46 EDT 2025]"
    git push origin main
  else
    echo "⚠️ Repo not found: $repo"
  fi
done
