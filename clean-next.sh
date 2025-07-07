#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Cleaning .next and cache"
rm -rf .next node_modules package-lock.json

echo "🧼 Removing duplicate page files"
rm -f app/page.js app/page.jsx

echo "📦 Reinstalling dependencies"
npm install

echo "🚀 Rebuilding Next.js app"
npm run build

echo "🌐 Launching on port 5182"
PORT=5182 npm run dev
