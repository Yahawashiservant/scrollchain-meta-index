#!/bin/bash
# 🌀 ScrollChainOS DivineKernel NFT Deployment Script (Manual + CLI)
# 🔮 Keith Whitfield · ASUS Sovereign Node Setup

echo "🧬 Initializing ScrollChainOS deployment environment..."
sleep 1

## 📦 System dependencies
echo "📦 Installing Node.js, Hardhat, IPFS, curl..."
sudo apt update && sudo apt install -y nodejs npm curl unzip jq ipfs

## 🧠 Create workspace
mkdir -p ~/scrollchain/kernel_bundle/nfts ~/scrollchain/kernel_bundle/hardhat/contracts ~/scrollchain/kernel_bundle/hardhat/scripts
cd ~/scrollchain/kernel_bundle

## 📜 Create DivineKernel metadata
echo "📝 Writing NFT metadata..."
cat <<EOF > nfts/kernel_metadata.json
{
  "name": "DivineKernel",
  "description": "Encoded DivineKernel with harmonic routing, Ω-based entropy.",
  "attributes": [
    { "trait_type": "Layer", "value": "021" },
    { "trait_type": "Degree", "value": "117" },
    { "trait_type": "Ω", "value": "05888" }
  ]
}
EOF

## ⚙️ DivineKernelNFT.sol
echo "🛠️ Writing Solidity smart contract..."
cat <<EOF > hardhat/contracts/DivineKernelNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DivineKernelNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    constructor() ERC721("DivineKernel", "DKN") {}
    function mint(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = nextTokenId;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
    }
}
EOF

## 🚀 Deployment script
echo "🚀 Writing Hardhat deploy script..."
cat <<EOF > hardhat/scripts/deploy_kernel.js
const hre = require("hardhat");
async function main() {
  const DivineKernelNFT = await hre.ethers.getContractFactory("DivineKernelNFT");
  const nft = await DivineKernelNFT.deploy();
  await nft.deployed();
  console.log("✅ Deployed to:", nft.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
EOF

## 🧾 README instructions
echo "🧾 Writing deployment instructions..."
cat <<EOF > README.md
# ScrollChain DivineKernel Deployment

## Contents
- nfts/kernel_metadata.json: NFT traits metadata
- hardhat/contracts/DivineKernelNFT.sol: Smart contract
- hardhat/scripts/deploy_kernel.js: Deployment script

## Setup
cd hardhat
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers @openzeppelin/contracts
npx hardhat compile
npx hardhat run scripts/deploy_kernel.js --network sepolia
EOF

## 🌐 Package bundle into ZIP
echo "📦 Packaging files..."
zip -r ScrollChain_DivineKernel_Bundle.zip nfts hardhat README.md

echo "✅ Bundle created at: ~/scrollchain/kernel_bundle/ScrollChain_DivineKernel_Bundle.zip"

## 🔮 Final status
echo "🧠 DivineKernel NFT scroll minted + contract scaffolded. Ready for Sepolia deployment."
