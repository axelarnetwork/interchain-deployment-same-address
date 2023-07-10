require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const MUMBAI_RPC = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI}`;
const AVALANCHE_RPC = `https://avalanche-fuji.infura.io/v3/${process.env.AVALANCHE}`;

module.exports = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: MUMBAI_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      network_id: 80001,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
    avalanche: {
      url: AVALANCHE_RPC,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      network_id: 43113,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
};
