
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    scroll: {
      url: "https://sepolia-rpc.scroll.io",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 534351
    },
    scrollMainnet: {
      url: "https://rpc.scroll.io",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: 534352
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      scroll: process.env.ETHERSCAN_API_KEY || "",
      scrollSepolia: process.env.ETHERSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/"
        }
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.dev/api",
          browserURL: "https://sepolia.scrollscan.dev/"
        }
      }
    ]
  }
};
