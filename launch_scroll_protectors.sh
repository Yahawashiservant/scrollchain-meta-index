#!/bin/bash
# 🛡️ Launch All ScrollProtectorBots

echo "🧠 Activating ScrollProtectorBot Fleet..."

for i in $(seq -w 01 20); do
  bot="agents/protectors/ScrollProtectorBot-$i.sh"
  if [ -f "$bot" ]; then
    echo "🔒 Launching $bot..."
    bash "$bot"
  else
    echo "⚠️ Missing $bot"
  fi
done

echo "✅ All available ScrollProtectorBots launched."
