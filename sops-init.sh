#!/bin/bash
KEYFILE="$HOME/.config/age/keys.txt"
mkdir -p secrets
if [ ! -f "$KEYFILE" ]; then
  echo "🔐 Generating age key..."
  mkdir -p "$(dirname "$KEYFILE")"
  age-keygen -o "$KEYFILE"
fi
AGE_RECIPIENT=$(grep AGE-SECRET "$KEYFILE" | cut -d' ' -f2)
sops --encrypt --age "$AGE_RECIPIENT" .env > secrets/prod.env.enc
echo "✅ .env encrypted to secrets/prod.env.enc"
echo "🔑 Store this AGE key in your GitHub repo secret: AGE_KEY"
