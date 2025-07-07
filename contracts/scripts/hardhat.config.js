require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    scrollSepolia: {
      url: "https://scroll-sepolia.g.alchemy.com/v2/UHFItU6CXDNTjxlJeD6V467ITftMMw6Y",
      accounts: .env
    }
  }
};