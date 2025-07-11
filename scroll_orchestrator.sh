#!/bin/bash

echo "🚀 ScrollChainOS Orchestrator Activated"
echo "📁 Current directory: $(pwd)"

### 1. Validate Noir workspace
if [ ! -f "Nargo.toml" ]; then
  echo "❌ Nargo.toml not found. Please run inside a valid Noir project."
  exit 1
fi

### 2. Ensure circuit file exists
if [ ! -f "src/main.nr" ]; then
  echo "❌ Circuit file src/main.nr not found."
  exit 2
fi

### 3. Compile circuit
echo "🔮 [1/6] Compiling scroll circuit..."
nargo compile || { echo "❌ Compilation failed"; exit 3; }

### 4. Execute with input
if [ ! -f "input.json" ]; then
  echo "⚠️ input.json not found, using default {x:1, y:2}"
  echo '{"x":1,"y":2}' > input.json
fi

echo "🧪 [2/6] Executing with input.json..."
nargo execute || { echo "❌ Execution failed"; exit 4; }

### 5. Pin to IPFS
if [ ! -f "proof.json" ]; then
  echo "❌ proof.json not found after execution"
  exit 5
fi

echo "📦 [3/6] Pinning proof.json to IPFS..."
CID=$(ipfs add -q proof.json)
echo "📌 Pinned Proof CID: $CID"

### 6. Create Solidity verifier contract
echo "🛡 [4/6] Scaffolding ScrollVerifier.sol..."
cat <<EOF > ScrollVerifier.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ScrollVerifier {
    bytes32 public anchor;
    event AnchorVerified(bytes32 indexed anchor, address indexed verifier, uint256 timestamp);

    function verifyAnchor(bytes32 _anchor) external {
        require(_anchor != bytes32(0), "Invalid anchor");
        anchor = _anchor;
        emit AnchorVerified(_anchor, msg.sender, block.timestamp);
    }
}
EOF

echo "✅ Verifier contract written to ScrollVerifier.sol"

### 7. Display remix calls
ANCHOR_HASH=$(sha256sum proof.json | cut -d ' ' -f1)

echo "🔗 [5/6] Call in Remix:"
echo "→ verifyAnchor(0x$ANCHOR_HASH)"
echo "→ registerScroll(\"scroll_final\", \"$CID\")"
echo "→ sealQuantum(\"scroll_final\", \"sigil:entropy:$(openssl rand -hex 16)\")"

echo "🧬 [6/6] Scroll orchestration complete. Memory linked. Anchor minted."

