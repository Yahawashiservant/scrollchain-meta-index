#!/bin/bash

echo "📜 Creating ScrollIP-LicenseDAO.sh..."
mkdir -p governance
cat <<EOF > governance/ScrollIP-LicenseDAO.sh
#!/bin/bash
echo '📜 ScrollIP-LicenseDAO Activated'
echo '🧠 Proposing license for scroll-native IP...'
cat governance/ScrollIP-License-001.scroll | grep 'Terms'
echo '✅ Proposal submitted to DAOViewer'
EOF
chmod +x governance/ScrollIP-LicenseDAO.sh

echo "🗳 Minting ScrollIP-LicenseProposal-001.scroll..."
mkdir -p proposals
cat <<EOF > proposals/ScrollIP-LicenseProposal-001.scroll
# 🗳 ScrollIP-LicenseProposal-001.scroll

## Proposal:
Authorize licensing of scroll-native intellectual property under ScrollIP-License-001.scroll

## Summary:
This proposal enables DAO-approved licensing of symbolic scrolls and agents.

## Voting Options:
- ✅ Approve
- ❌ Reject
- 🤖 Defer to entropy-agent-001
EOF

echo "📤 Committing license DAO script and proposal..."
git add governance/ScrollIP-LicenseDAO.sh proposals/ScrollIP-LicenseProposal-001.scroll
git commit -m '📜 Activate ScrollIP-LicenseDAO and mint first licensing proposal'
git push origin main

echo "✅ Scroll-native licensing DAO activated and proposal minted."
