
// SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
// ScrollEntropy Contract Deployment Script
// Author: Keith D. Whitfield — ScrollChain Architect

const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("🚀 Deploying ScrollEntropy contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy ScrollEntropy Token
  console.log("\n📜 Deploying ScrollEntropy Token...");
  const ScrollEntropyToken = await ethers.getContractFactory("ScrollEntropyToken");
  const scrollToken = await ScrollEntropyToken.deploy();
  await scrollToken.deployed();
  console.log("✅ ScrollEntropy Token deployed to:", scrollToken.address);

  // Deploy ScrollEntropy NFT
  console.log("\n🎨 Deploying ScrollEntropy NFT...");
  const ScrollEntropyNFT = await ethers.getContractFactory("ScrollEntropyNFT");
  const scrollNFT = await ScrollEntropyNFT.deploy(deployer.address); // Treasury is deployer for now
  await scrollNFT.deployed();
  console.log("✅ ScrollEntropy NFT deployed to:", scrollNFT.address);

  // Deploy ScrollEntropy DAO
  console.log("\n🏛️ Deploying ScrollEntropy DAO...");
  const ScrollEntropyDAO = await ethers.getContractFactory("ScrollEntropyDAO");
  const scrollDAO = await ScrollEntropyDAO.deploy(
    scrollToken.address,
    scrollNFT.address,
    deployer.address
  );
  await scrollDAO.deployed();
  console.log("✅ ScrollEntropy DAO deployed to:", scrollDAO.address);

  // Mint initial tokens to deployer
  console.log("\n💎 Minting initial tokens...");
  const initialMint = ethers.utils.parseEther("10000"); // 10,000 tokens
  await scrollToken.mint(deployer.address, initialMint);
  console.log("✅ Minted 10,000 SCROLL tokens to deployer");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ScrollEntropyToken: {
        address: scrollToken.address,
        abi: "artifacts/contracts/ScrollEntropyToken.sol/ScrollEntropyToken.json"
      },
      ScrollEntropyNFT: {
        address: scrollNFT.address,
        abi: "artifacts/contracts/ScrollEntropyNFT.sol/ScrollEntropyNFT.json"
      },
      ScrollEntropyDAO: {
        address: scrollDAO.address,
        abi: "artifacts/contracts/ScrollEntropyDAO.sol/ScrollEntropyDAO.json"
      }
    }
  };

  // Create deployments directory if it doesn't exist
  if (!fs.existsSync("deployments")) {
    fs.mkdirSync("deployments");
  }

  // Write deployment info
  fs.writeFileSync(
    `deployments/${hre.network.name}-deployment.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🌐 Network: ${hre.network.name}`);
  console.log(`👤 Deployer: ${deployer.address}`);
  console.log(`📜 SCROLL Token: ${scrollToken.address}`);
  console.log(`🎨 SCROLL NFT: ${scrollNFT.address}`);
  console.log(`🏛️ SCROLL DAO: ${scrollDAO.address}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📁 Deployment saved to: deployments/${hre.network.name}-deployment.json`);
  
  // Update .env.development
  const envPath = ".env.development";
  let envContent = "";
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }
  
  // Add or update contract addresses
  const newEnvVars = [
    `SCROLL_TOKEN_ADDRESS=${scrollToken.address}`,
    `SCROLL_NFT_ADDRESS=${scrollNFT.address}`,
    `SCROLL_DAO_ADDRESS=${scrollDAO.address}`,
    `DEPLOYER_ADDRESS=${deployer.address}`,
    `NETWORK=${hre.network.name}`
  ];
  
  newEnvVars.forEach(envVar => {
    const [key] = envVar.split("=");
    const regex = new RegExp(`^${key}=.*$`, "m");
    
    if (envContent.match(regex)) {
      envContent = envContent.replace(regex, envVar);
    } else {
      envContent += `\n${envVar}`;
    }
  });
  
  fs.writeFileSync(envPath, envContent.trim() + "\n");
  console.log(`✅ Environment variables updated in ${envPath}`);
  
  console.log("\n🎉 ScrollEntropy production deployment complete!");
  console.log("🔗 Next steps:");
  console.log("   1. Run the API server: npm run start");
  console.log("   2. Open the dashboard: http://0.0.0.0:5000");
  console.log("   3. Start minting agents and deploying kernels!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
