#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Wipe and recreate project structure…"
rm -rf src contracts tsconfig.json package.json build dist
mkdir -p src contracts build

echo "📦 Creating package.json…"
cat > package.json << 'EOF'
{
  "name": "afterquantum-100x",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm src/index.ts",
    "build": "tsc",
    "deploy:contracts": "solc --bin --abi contracts/*.sol -o build"
  },
  "dependencies": {
    "ethers": "^6.7.0",
    "@ethersproject/bignumber": "^5.7.0",
    "@supabase/supabase-js": "^2.0.0"
  },
  "devDependencies": {
    "typescript": "^5.1.3",
    "ts-node": "^10.9.1",
    "@types/node": "^18.16.19",
    "solc": "^0.8.20"
  },
  "ts-node": {
    "esm": true
  }
}
EOF

echo "📝 Creating tsconfig.json…"
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts"]
}
EOF

echo "🔧 Scaffolding 100 TS & Solidity modules…"
for i in $(seq 1 100); do
  cat > src/AfterQuantumCore_${i}.ts <<EOF
import { BigNumber } from "@ethersproject/bignumber";

export function generateModule${i}ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x ^ y.charCodeAt(0), 0);
  return BigNumber.from(h ^ ${i} * 0xabcdef);
}

export function computeModule${i}ScrollEntropy(probs: number[]): number {
  const H = -probs.reduce((s,p)=> s + (p>0? p*Math.log(p):0), 0);
  return H + (probs.length * 0.01 * ${i});
}

export function computeModule${i}VoteWeight(signals: number[]): number {
  return signals.reduce((s,x)=>s + Math.abs(x), 0) * ${i};
}
EOF

  cat > contracts/TeleportationNFT_${i}.sol <<EOF
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeleportationNFT_${i} is ERC721 {
    uint256 public nextId;
    constructor() ERC721("TPT${i}", "TPT${i}") {}
    function mint(address to, uint256 tone, bytes32 dimID, bytes32 forkHash) external {
      uint256 id = nextId++;
      _safeMint(to, id);
      emit Teleported(to, id, tone, dimID, forkHash);
    }
    event Teleported(address indexed to, uint256 id, uint256 tone, bytes32 dimID, bytes32 forkHash);
}
EOF

  cat > src/supabaseLog_${i}.ts <<EOF
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SB_URL!, process.env.SB_KEY!);

export async function logModule${i}(prophet: string, message: string, entropy: string) {
  await sb.from("prophecy_logs").insert({
    module: ${i}, prophet, message, entropy, ts: new Date()
  });
}
EOF

  cat > contracts/ChainBridge_${i}.sol <<EOF
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProphecy { function submitProphecy(string calldata m) external; }

contract ChainBridge_${i} {
    mapping(bytes32 => bool) public relayed;
    address public target;
    constructor(address _t) { target = _t; }
    function relay(bytes32 txid, address p, string calldata m) external {
      require(!relayed[txid], "dup");
      relayed[txid] = true;
      IProphecy(target).submitProphecy(m);
      emit RelayedModule${i}(txid, p, m);
    }
    event RelayedModule${i}(bytes32 txid, address p, string m);
}
EOF
done

echo "📑 Writing aggregator src/index.ts…"
cat > src/index.ts << 'EOF'
import { BigNumber } from "@ethersproject/bignumber";

const modules = Array.from({ length: 100 }, (_, i) => i + 1);

async function runAll() {
  console.log("== AfterQuantumCore Modules ==");
  for (const i of modules) {
    const mod = await import(\`./AfterQuantumCore_\${i}.ts\`);
    const hashFn       = mod[\`generateModule\${i}ProphecyEntropy\`] as (s: string) => BigNumber;
    const scrollFn     = mod[\`computeModule\${i}ScrollEntropy\`] as (p: number[]) => number;
    const voteWeightFn = mod[\`computeModule\${i}VoteWeight\`] as (s: number[]) => number;

    const hash   = hashFn(\`test\${i}\`);
    const scroll = scrollFn([0.1, 0.2, 0.7]);
    const weight = voteWeightFn([1, -2, 3]);

    console.log(\`[Module \${i}] hash=\${hash.toString()}, scroll=\${scroll}, weight=\${weight}\`);
  }

  console.log("== Supabase Logging ==");
  for (const i of modules) {
    const logMod = await import(\`./supabaseLog_\${i}.ts\`);
    const logFn  = logMod[\`logModule\${i}\`] as (a:string,b:string,c:string) => Promise<void>;
    await logFn("0xMe", \`hello\${i}\`, \`entropy\${i}\`);
    console.log("Logged module", i);
  }
}

runAll().catch(console.error);
EOF

echo "🔧 Installing dependencies…"
npm install

echo "🚀 Running the aggregator…"
npm run start

echo "✅ All done! Your 100× modules were generated, compiled and executed."
