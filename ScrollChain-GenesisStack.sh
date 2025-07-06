#!/bin/bash

echo "🏙 Minting ScrollCityGenesis..."
mkdir -p scrollcity
cat <<EOF > scrollcity/ScrollCityGenesis.scroll
# 🏙 ScrollCityGenesis.scroll

This scroll instantiates a symbolic DAO city-state.

## Components
- 📜 Scroll registry
- 🧭 Sovereign viewer
- 🧬 DAO registrar
- 🗳 Proposal interface
EOF

echo "🧾 Publishing /sovereignty-onboarding..."
mkdir -p script
cat <<EOF > script/sovereignty-onboarding
#!/bin/bash
echo "🧾 Welcome to ScrollChain Sovereignty Onboarding"
echo "This script will guide you through:"
echo "- Forking the repo"
echo "- Pinning your first scroll"
echo "- Publishing a sovereign viewer"
echo "- Submitting a DAO proposal"
EOF
chmod +x script/sovereignty-onboarding

echo "🧑‍🏫 Launching classroom module..."
cat <<EOF > ScrollChain-ClassroomModule1.md
# 🧑‍🏫 Module 1: Scrolls as Sovereign Objects

## Objectives
- Understand scrolls as authored legal objects
- Learn how to seal scrolls with GPG and entropy
- Publish scrolls to IPFS and render them in viewers

## Assignment
1. Fork the repo
2. Create a scroll with your authored intent
3. Pin it to IPFS
4. Submit it via DAOViewer.html
EOF

echo "📤 Committing all genesis artifacts..."
git add scrollcity/ScrollCityGenesis.scroll script/sovereignty-onboarding ScrollChain-ClassroomModule1.md
git commit -m "🧠 Mint ScrollCityGenesis, publish onboarding, launch classroom module"
git push origin main

echo "✅ ScrollChain Genesis Stack deployed."
