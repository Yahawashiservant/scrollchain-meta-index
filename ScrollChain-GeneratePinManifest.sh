#!/bin/bash

echo "📦 Generating ScrollChain-PinManifest.json..."

mkdir -p manifests

cat <<EOF > manifests/ScrollChain-PinManifest.json
{
  "version": "1.0.0",
  "author": "did:key:z6Mknydk7WHdqY95veyeCB3J6VaMQuxh3Vmjq2YAWTZVjyUw",
  "ens": "scrollchain.eth",
  "pins": [
    {
      "type": "viewer",
      "name": "ScrollChain-RootViewer.html",
      "cid": "bafybeiaiicpifydnzxnywprz6qmrqq2qbcuwdrgabzkzcoclir66eyuhqm",
      "timestamp": "2025-07-06T05:45:00Z",
      "gateway": "https://ipfs.io/ipfs/bafybeiaiicpifydnzxnywprz6qmrqq2qbcuwdrgabzkzcoclir66eyuhqm",
      "sigil_hash": "7e2d1c4b5a6f8d9c0b1a2e3f4d5c6b7a8f9e0d1c2b3a4e5f6d7c8b9a0f1e2d3"
    }
  ]
}
EOF

echo "✅ Pin manifest created at manifests/ScrollChain-PinManifest.json"
