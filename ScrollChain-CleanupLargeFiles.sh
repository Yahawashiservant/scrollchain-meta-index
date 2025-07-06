# Authored by Keith D. Whitfield
# Visionary Architect of ScrollChain and Symbolic Civilization

#!/bin/bash

echo "🧹 Installing git-filter-repo..."
pip install git-filter-repo

echo "🧼 Removing oversized files from history..."
git filter-repo --path ScrollChain-Viewer.car --path ScrollChain-MetaIndex.car --path scrollchain-infra-v1.0.0.zip --invert-paths

echo "📤 Force pushing cleaned repo..."
git push origin main --force

echo "✅ Oversized files removed and repo pushed clean."
