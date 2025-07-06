# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
# Authored by Keith D. Whitfield — ScrollChain Architect

# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash
TODAY=$(date +%F)
mkdir -p conversations/chatgpt conversations/copilot

# ChatGPT export (assumes chat_history_*.json exists)
if ls chat_history_*.json 1> /dev/null 2>&1; then
  jq -r '.[] | .title, .messages[]?.content' chat_history_*.json > "conversations/chatgpt/$TODAY.md"
fi

# Copilot logs (adjust path if needed)
COPILOT_LOGS="$HOME/.copilot/chat_logs"
if [ -d "$COPILOT_LOGS" ]; then
  cp -R "$COPILOT_LOGS" "conversations/copilot/$TODAY"
fi

git add conversations/
git commit -m "Weekly scroll log sync: $TODAY" || echo "No changes to commit"
git push origin main
