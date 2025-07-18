#!/bin/bash
# 🧠 ScrollChainOS Diagnostic Script

echo "🔍 Scanning ScrollChainOS server modules..."

modules=(
  "dashboard-api.js"
  "extended-api.js"
  "brainkernel-api.js"
  "fusion-api.js"
  "prophecy-api.js"
  "consultation-api.js"
  "blueprint-api.js"
  "bigquery-api.js"
)

missing=()
for file in "${modules[@]}"; do
  if [ -f "server/$file" ]; then
    echo "✅ server/$file — Present"
  else
    echo "❌ server/$file — Missing"
    missing+=("$file")
  fi
done

echo ""
if [ ${#missing[@]} -eq 0 ]; then
  echo "🧬 All server modules are present and ready."
else
  echo "⚠️ Missing modules:"
  for m in "${missing[@]}"; do
    echo "   - $m"
  done
  echo "💡 Consider scaffolding these before restarting the server."
fi
