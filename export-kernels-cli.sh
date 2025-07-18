#!/bin/bash
# 🧠 ScrollChainOS Kernel Export CLI

echo "📦 Exporting kernels for CLI deployment..."

kernel_dir="brainkernels"
export_dir="cli_exports"
mkdir -p "$export_dir"

for scroll in "$kernel_dir"/*.scroll; do
  base=$(basename "$scroll" .scroll)
  out="$export_dir/$base.js"

  echo "🧠 Packaging $base → $out"
  echo "// Exported from ScrollChainOS" > "$out"
  echo "module.exports = function(env) {" >> "$out"
  echo "  return {" >> "$out"
  echo "    name: '$base'," >> "$out"
  echo "    traits: ['SovereignMemory', 'DAOCompliance']," >> "$out"
  echo "    sigil: 'RaWaChaaQadash'," >> "$out"
  echo "    envHooks: env" >> "$out"
  echo "  };" >> "$out"
  echo "};" >> "$out"
done

echo "✅ Kernels exported to $export_dir/"
