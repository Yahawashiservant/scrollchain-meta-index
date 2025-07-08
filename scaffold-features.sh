#!/usr/bin/env bash
set -euo pipefail

echo "🛠 Cleaning up old files…"
rm -rf src contracts
mkdir -p src contracts

for i in $(seq 1 100); do
  # AfterQuantumCore TS
  cat > src/AfterQuantumCore_${i}.ts <<EOF
import { BigNumber } from "ethers";

export function generateModule${i}ProphecyEntropy(msg: string): BigNumber {
  let h = Array.from(msg).reduce((x,y)=>x^y.charCodeAt(0), 0);
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

  # TeleportationNFT Solidity
  cat > contracts/TeleportationNFT_${i}.sol <<EOF
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TeleportationNFT_${i} is ERC721 {
    uint256 public nextId;
    constructor() ERC721("TPT${i}","TPT${i}"){}
    function mint(address to, uint256 tone, bytes32 dimID, bytes32 forkHash) external {
      uint256 id = nextId++;
      _safeMint(to,id);
      emit Teleported(to, id, tone, dimID, forkHash);
    }
    event Teleported(address indexed to, uint256 id, uint256 tone, bytes32 dimID, bytes32 forkHash);
}
EOF

  # Supabase Logger TS
  cat > src/supabaseLog_${i}.ts <<EOF
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.SB_URL!, process.env.SB_KEY!);

export async function logModule${i}(prophet: string, message: string, entropy: string) {
  await sb.from("prophecy_logs").insert({ module: ${i}, prophet, message, entropy, ts: new Date() });
}
EOF

  # ChainBridge Solidity
  cat > contracts/ChainBridge_${i}.sol <<EOF
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IProphecy {
  function submitProphecy(string calldata msg) external;
}

contract ChainBridge_${i} {
    mapping(bytes32=>bool) public relayed;
    address public target;
    constructor(address _t){ target=_t; }
    function relay(bytes32 txid, address p, string calldata m) external {
      require(!relayed[txid], "dup");
      relayed[txid]=true;
      IProphecy(target).submitProphecy(m);
      emit RelayedModule${i}(txid,p,m);
    }
    event RelayedModule${i}(bytes32 txid, address p, string m);
}
EOF
done

# Aggregator entrypoint
cat > src/index.ts <<'EOF'
import { BigNumber } from "ethers";

const modules = Array.from({ length: 100 }, (_, i) => i + 1);
async function runAll() {
  for (const i of modules) {
    const mod = await import(\`./AfterQuantumCore_\${i}\`);
    const hashFn  = mod[\`generateModule\${i}ProphecyEntropy\`] as (s: string)=>BigNumber;
    const scrollFn= mod[\`computeModule\${i}ScrollEntropy\`]   as (p: number[])=>number;
    const weightFn= mod[\`computeModule\${i}VoteWeight\`]      as (s: number[])=>number;
    console.log(\`[\${i}] hash=\${hashFn("test").toString()}, scroll=\${scrollFn([0.2,0.5])}, weight=\${weightFn([1,-1])}\`);
  }
  for (const i of modules) {
    const logMod = await import(\`./supabaseLog_\${i}\`);
    const logFn  = logMod[\`logModule\${i}\`] as (a:string,b:string,c:string)=>Promise<void>;
    await logFn("0xMe", "hello", "entropy");
    console.log("Logged", i);
  }
}
runAll().catch(console.error);
EOF

# Deploy-all stub
cat > deploy-all.sh <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
npm install
npx tsc
solc --bin --abi contracts/*.sol -o build
echo "🔧 (Mock) Deploying 100 contracts..."
for i in \$(seq 1 100); do
  echo "Deploying module \$i..."
done
EOF
chmod +x deploy-all.sh

echo "🎉 scaffold-features.sh created. Run ./deploy-all.sh to compile & deploy."
