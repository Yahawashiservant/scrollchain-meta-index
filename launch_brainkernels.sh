#!/bin/bash
# 🧠 ScrollChainOS BrainKernel Launcher

echo "🧬 Activating BrainKernel Intelligence Modules..."

brainkernel_dir="brainkernels"
if [ ! -d "$brainkernel_dir" ]; then
  echo "⚠️ No brainkernels directory found."
  exit 1
fi

for scroll in "$brainkernel_dir"/*.scroll; do
  if [ -f "$scroll" ]; then
    echo "🧠 Activating $(basename "$scroll")..."
    head -n 5 "$scroll" | sed 's/^/   🔹 /'
  else
    echo "⚠️ No .scroll files found in $brainkernel_dir"
  fi
done

echo "✅ BrainKernel modules activated."
