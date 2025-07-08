#!/bin/bash

echo "🧹 Removing old Noir build..."
rm -rf ~/workspace/noir

echo "📥 Cloning latest Noir..."
cd ~/workspace
git clone https://github.com/noir-lang/noir.git
cd noir

echo "🔧 Building nargo from source..."
cargo build --release

echo "✅ Exporting nargo path..."
export PATH="$PATH:$(pwd)/target/release"
echo 'export PATH="$PATH:'"$(pwd)/target/release"'"' >> ~/.bashrc

echo "🎉 Rebuild complete. You can now run:"
echo "  nargo new zk_sigil_anchor"
