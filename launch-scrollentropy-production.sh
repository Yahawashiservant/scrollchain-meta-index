
#!/bin/bash
# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
# ScrollEntropy Production Launch Script
# Author: Keith D. Whitfield — ScrollChain Architect

echo "🧬 ScrollEntropy Sovereign AI Production System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔮 Initializing real NFT minting, DAO governance, and edge deployment..."

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "⚠️  Creating .env.development with default values..."
    cat > .env.development << EOF
# ScrollEntropy Production Environment
PORT=5000
NODE_ENV=development

# Blockchain Configuration
RPC_URL=https://sepolia-rpc.scroll.io
NETWORK=scroll

# API Keys (replace with your own)
OPENAI_API_KEY=your_openai_key_here
WEB3_STORAGE_TOKEN=your_web3_storage_token_here
PINATA_API_KEY=your_pinata_key_here
PINATA_SECRET=your_pinata_secret_here

# Contract Addresses (will be updated after deployment)
SCROLL_TOKEN_ADDRESS=
SCROLL_NFT_ADDRESS=
SCROLL_DAO_ADDRESS=
DEPLOYER_PRIVATE_KEY=your_private_key_here

# System Configuration
MINT_PRICE=0.01
PLATFORM_FEE=250
TREASURY_ADDRESS=your_treasury_address_here
EOF
    echo "✅ .env.development created. Please update with your API keys and private key."
fi

echo ""
echo "🔧 Installing dependencies..."
npm install

echo ""
echo "🏗️  Compiling contracts..."
npx hardhat compile

echo ""
echo "🚀 Deploying contracts to Scroll testnet..."
npx hardhat run scripts/deploy.js --network scroll

echo ""
echo "📊 Starting ScrollEntropy API server..."
echo "🌐 Dashboard will be available at: http://0.0.0.0:5000"
echo "🧠 Kernel management: http://0.0.0.0:5000/api/kernel/status"
echo "🎨 Agent minting: http://0.0.0.0:5000/api/agent/mint"
echo ""
echo "🎉 ScrollEntropy production system is now LIVE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start the server
node src/ScrollEntropyAPI.js
