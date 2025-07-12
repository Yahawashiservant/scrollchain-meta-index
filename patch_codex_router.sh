#!/usr/bin/env bash
echo "🧭 Patching Codex router with /codex-cid-map view..."

APP_PATH="scrollchain-meta-index/src/App.tsx"

# Check and insert route if not already present
if grep -q 'CodexCIDMap' "$APP_PATH"; then
  echo "✅ CodexCIDMap already routed."
else
  # Import line
  sed -i "/CodexObservatory/a import CodexCIDMap from \"./pages/CodexCIDMap\";" "$APP_PATH"

  # Route line
  sed -i '/<Routes>/a <Route path="/codex-cid-map" element={<MainLayout><CodexCIDMap /></MainLayout>} />' "$APP_PATH"

  echo "✅ Route inserted: /codex-cid-map ➝ CodexCIDMap.tsx"
fi
