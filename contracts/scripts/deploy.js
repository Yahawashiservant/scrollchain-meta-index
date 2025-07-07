const hre = require("hardhat");

async function main() {
  const Prophecy = await hre.ethers.getContractFactory("ProphecyScroll");
  const prophecy = await Prophecy.deploy();
  await prophecy.deployed();
  console.log("📜 ProphecyScroll deployed to:", prophecy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});