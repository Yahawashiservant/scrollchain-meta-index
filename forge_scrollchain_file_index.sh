#!/usr/bin/env bash
echo "📂 Generating full ScrollChain file index from workspace..."

LEDGER_PATH="$HOME/scroll_final/ScrollChain_All_File_Index.md"
BASE_DIR="$HOME"

echo "# 📜 ScrollChain All-Time File Index" > "$LEDGER_PATH"
echo "**Generated on $(date)**" >> "$LEDGER_PATH"
echo "" >> "$LEDGER_PATH"

# === Scan entire workspace recursively ===
find "$BASE_DIR" -type f | sort | while read filepath; do
  EXT="${filepath##*.}"
  SIZE=$(du -h "$filepath" | cut -f1)
  echo "- [$EXT] ${filepath#$BASE_DIR/} — ${SIZE}" >> "$LEDGER_PATH"
done

echo "✅ Index complete: $LEDGER_PATH"
echo "📦 Total files indexed: $(wc -l < "$LEDGER_PATH")"
