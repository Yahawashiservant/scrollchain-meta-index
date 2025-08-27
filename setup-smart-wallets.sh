#!/bin/bash

# ScrollChain Smart Wallets Setup Script
# This script helps users set up the smart wallets application correctly

echo "🧭 ScrollChain Smart Wallets Setup"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "my-smart-wallets-app" ]; then
    echo "❌ Error: Please run this script from the scrollchain-meta-index root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: package.json, my-smart-wallets-app/ directory"
    exit 1
fi

echo "✅ Verified we're in the correct directory"
echo ""

# Navigate to smart wallets app
cd my-smart-wallets-app

echo "📁 Navigating to smart wallets app directory..."
echo "   Current directory: $(pwd)"
echo ""

# Check if .env.local exists, if not create it from .env.example
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Environment file created at: $(pwd)/.env.local"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env.local and set your actual API keys:"
    echo "   - NEXT_PUBLIC_ALCHEMY_API_KEY (get from https://dashboard.alchemy.com/apps)"
    echo "   - NEXT_PUBLIC_ALCHEMY_POLICY_ID (get from https://dashboard.alchemy.com/services/gas-manager/configuration)"
    echo ""
else
    echo "✅ Environment file already exists: .env.local"
    echo ""
fi

# Install dependencies
echo "📦 Installing smart wallets app dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🚀 Setup complete! You can now:"
    echo "   1. Edit .env.local with your API keys (if you haven't already)"
    echo "   2. Run 'npm run dev' to start the development server"
    echo "   3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 Useful commands:"
    echo "   npm run dev     # Start development server"
    echo "   npm run build   # Build for production"
    echo "   npm run start   # Run production build"
    echo "   npm run lint    # Lint code"
    echo ""
else
    echo "❌ Error installing dependencies. Please check the error messages above."
    exit 1
fi