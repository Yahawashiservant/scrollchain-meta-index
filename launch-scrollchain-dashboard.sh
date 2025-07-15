
#!/usr/bin/env bash

echo "🧭 Launching ScrollChain Sovereign Dashboard..."
echo "🔑 Author: Keith D. Whitfield — ScrollChain Architect"

# Check if required files exist
if [ ! -f "src/dashboardServer.js" ]; then
    echo "❌ dashboardServer.js not found"
    exit 1
fi

if [ ! -f "public/index.html" ]; then
    echo "❌ index.html not found"
    exit 1
fi

if [ ! -f "public/glyph_module.js" ]; then
    echo "❌ glyph_module.js not found"
    exit 1
fi

# Load environment variables if available
if [ -f ".env.development" ]; then
    echo "🔐 Loading development environment variables..."
    export $(cat .env.development | xargs)
fi

if [ -f "credentials/api/scrollchain.env" ]; then
    echo "🔐 Loading ScrollChain API credentials..."
    export $(cat credentials/api/scrollchain.env | xargs)
fi

# Set default port if not specified
export PORT=${PORT:-5000}
export NODE_ENV=${NODE_ENV:-development}

echo "🌀 Installing dependencies..."
npm install --silent

echo "📊 Starting ScrollChain Dashboard Server..."
echo "🚀 Dashboard will be available at: http://0.0.0.0:${PORT}"
echo "🧬 Codex backend bridge initialized"
echo "📡 Real-time entropy visualization active"
echo "🔮 NFT minting codex ready"
echo "🧠 Brain kernel monitoring enabled"
echo "🌍 DAO governance threads synchronized"
echo "🔑 Key gate authenticator deployed"

# Start the server
node src/dashboardServer.js
