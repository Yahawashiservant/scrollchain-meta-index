#!/bin/bash

# Fix Nargo.toml
cat > Nargo.toml <<EOF
[package]
name = "scroll_final"
version = "0.1.0"
type = "bin"
EOF

# Ensure src/main.nr exists
mkdir -p src
cat > src/main.nr <<EOF
fn main(x: Field, y: Field) -> Field {
    x + y
}
EOF

# Initialize git if not already a repo
if [ ! -d .git ]; then
  git init
fi

git add .
git commit -m "Repair: correct package name and main.nr"
git tag v2.0.0

echo "✅ Noir project and git repo repaired. You can now run:"
echo "   nargo compile"
echo "   nargo execute"
