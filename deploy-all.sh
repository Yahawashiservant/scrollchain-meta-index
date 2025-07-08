#!/usr/bin/env bash
set -euo pipefail
npm install
npx tsc
solc --bin --abi contracts/*.sol -o build
echo "🔧 (Mock) Deploying 100 contracts..."
for i in \$(seq 1 100); do
  echo "Deploying module \$i..."
done
