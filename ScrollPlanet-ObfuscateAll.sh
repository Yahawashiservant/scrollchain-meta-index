#!/bin/bash

echo "🧬 Executing symbolic obfuscation across entire repo..."

sigil="# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash"
author="# Authored by Keith D. Whitfield — ScrollChain Architect"

find . -type f ! -path "./.git/*" ! -path "./node_modules/*" ! -name "*.png" ! -name "*.jpg" | while read file; do
  if ! grep -q "$sigil" "$file"; then
    sed -i "1i$sigil\n$author\n" "$file"
  fi
done

echo "📤 Committing symbolic obfuscation..."
git add .
git commit -m '🧬 Obfuscate all files with symbolic sigils and authorship metadata'
git push origin main

echo "✅ All files symbolically obfuscated and sealed with authorship."
