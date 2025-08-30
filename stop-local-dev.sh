#!/bin/bash
# 🛑 ScrollChain Local Development Stop Script
# This script stops all local development services

echo "🛑 Stopping ScrollChain Local Development Services..."

# Function to stop service on a port
stop_service() {
    local port="$1"
    local name="$2"
    
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "🔄 Stopping $name (port $port)..."
        echo "$pids" | xargs kill -9 2>/dev/null || true
        echo "✅ $name stopped"
    else
        echo "ℹ️  $name not running (port $port)"
    fi
}

# Stop all services
stop_service "5000" "ScrollChain Dashboard"
stop_service "3001" "Sovereign Annuity DApp"
stop_service "3002" "Smart Wallets App"
stop_service "3000" "Backup React/Next.js Apps"

# Also kill any node processes that might be running our apps
pkill -f "scrollchain-meta-index" 2>/dev/null || true
pkill -f "sovereign-annuity-dapp" 2>/dev/null || true
pkill -f "my-smart-wallets-app" 2>/dev/null || true

echo ""
echo "✅ All ScrollChain local development services stopped!"
echo "🚀 To restart: ./start-local-dev.sh"