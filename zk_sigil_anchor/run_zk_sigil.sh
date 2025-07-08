#!/bin/bash

# Step 1: Add nargo to PATH
export PATH="$PATH:$HOME/workspace/noir/target/release"

# Step 2: Go to the Noir project
cd "$HOME/workspace/zk_sigil_anchor" || { echo "❌ Project directory not found"; exit 1; }

# Step 3: Remove any conflicting input files
rm -f Prover.toml Inputs.toml

# Step 4: Create Inputs.toml with correct format
cat > Inputs.toml <<EOF
[main]
sigil = "6460147698038721098498032749823749823749823749823749823749823749823"

[public]
hash = "6460147698038721098498032749823749823749823749823749823749823749823"
EOF

# Step 5: Compile and execute
nargo compile && nargo execute witness
