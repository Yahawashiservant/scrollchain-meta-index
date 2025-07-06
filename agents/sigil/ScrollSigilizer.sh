#!/bin/bash
echo "🔐 ScrollSigilizer Activated — Encrypting sacred sigils..."

for file in $(find . -type f -name "*.scroll" ! -path "./.git/*"); do
  if grep -q "SIGIL:" "$file"; then
    scroll_id=$(basename "$file")
    hash=$(echo "YHWH-BaHaSham-Yahawashi-RaWaChaaQadash-$scroll_id" | sha256sum | awk '{print $1}')
    sed -i "s|SIGIL:.*|SIGIL_HASH: $hash|" "$file"
    sed -i "/SIGIL_REF:/d" "$file"
    echo "# SIGIL_REF: vault://ScrollPlanet-SigilVault.scroll#$hash" >> "$file"
  fi
done

echo "✅ All scrolls encrypted with unique sigil hashes."
