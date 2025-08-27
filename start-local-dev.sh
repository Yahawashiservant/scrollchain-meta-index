#!/bin/bash
# 🚀 ScrollChain Local Development Startup Script
# This script starts all services needed for local development

set -e

echo "🧭 Starting ScrollChain Meta Index Local Development Environment"
echo "================================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the scrollchain-meta-index directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

# Check environment files
if [ ! -f ".env.local" ]; then
    echo "⚙️  Creating .env.local from template..."
    cp .env.template .env.local
    echo "✏️  Edit .env.local to add your API keys for full functionality"
fi

if [ ! -f "my-smart-wallets-app/.env.local" ]; then
    echo "⚙️  Creating smart wallets .env.local..."
    cp my-smart-wallets-app/.env.example my-smart-wallets-app/.env.local
    echo "✏️  Edit my-smart-wallets-app/.env.local to add your Alchemy keys"
fi

echo ""
echo "🚀 Starting services..."
echo "================================"

# Function to start a service in background
start_service() {
    local name="$1"
    local command="$2"
    local port="$3"
    local url="$4"
    
    echo "🔄 Starting $name on port $port..."
    
    # Kill any existing process on the port
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    
    # Start the service
    eval "$command" &
    local pid=$!
    
    # Wait a moment and check if it's still running
    sleep 2
    if kill -0 $pid 2>/dev/null; then
        echo "✅ $name started successfully - $url"
    else
        echo "❌ $name failed to start"
    fi
}

# Start main dashboard
start_service "ScrollChain Dashboard" "npm start" "5000" "http://localhost:5000"

# Wait a bit for the main service to start
sleep 3

# Start React app
start_service "Sovereign Annuity DApp" "cd sovereign-annuity-dapp && PORT=3001 npm start" "3001" "http://localhost:3001"

# Start Next.js app
start_service "Smart Wallets App" "cd my-smart-wallets-app && PORT=3002 npm run dev" "3002" "http://localhost:3002"

echo ""
echo "🎉 All services started!"
echo "========================"
echo ""
echo "📊 Service URLs:"
echo "  🖥️  Main Dashboard:      http://localhost:5000"
echo "  🏛️  Sovereign Annuity:   http://localhost:3001"
echo "  💼 Smart Wallets:       http://localhost:3002"
echo ""
echo "📡 API Endpoints:"
echo "  🔍 Health Check:        http://localhost:5000/api/health"
echo "  🧬 Kernel Status:       http://localhost:5000/api/kernel/status"
echo "  🤖 Agents:             http://localhost:5000/api/agents"
echo ""
echo "⚙️  Configuration:"
echo "  📝 Edit .env.local for main project API keys"
echo "  📝 Edit my-smart-wallets-app/.env.local for Alchemy keys"
echo ""
echo "🛑 To stop all services: Ctrl+C or run: ./stop-local-dev.sh"
echo ""

# Keep script running to monitor services
echo "📡 Monitoring services... (Press Ctrl+C to stop all)"
wait