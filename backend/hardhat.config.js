require("@nomicfoundation/hardhat-toolbox");
require("./node_modules/hardhat-deploy");
require('dotenv').config();

const PK = process.env.PK || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      initialBaseFeePerGas: 0,
      chainId: 31337
    },
    arpaChain : {
      url: "http://192.168.10.124:8545",
      initialBaseFeePerGas: 0,
      accounts: [`${PK}`],
      chainId: 222222
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19"
      }
    ]
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 100,
    },
    viaIR: true,
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
  },
};