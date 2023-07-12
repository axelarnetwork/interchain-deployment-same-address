import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';

dotenv.config();

const MUMBAI_RPC = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI}`;
const AVALANCHE_RPC = `https://avalanche-fuji.infura.io/v3/${process.env.AVALANCHE}`;

const config: HardhatUserConfig = {
    solidity: '0.8.18',
    networks: {
        mumbai: {
            url: MUMBAI_RPC,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            network_id: 80001,
            timeoutBlocks: 200,
            gas: 6000000, // Use around 4836635 in total.
            gasLimit: 210000,
            gasPrice: 4000000000, // Check standard gas price at https://gasstation-mumbai.matic.today/
            skipDryRun: true,
        },
        avalanche: {
            url: AVALANCHE_RPC,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            network_id: 43113,
            timeoutBlocks: 200,
            gas: 6000000, // Use around 4836635 in total.
            gasPrice: 25000000000, // Check standard gas price at https://gasstation-mumbai.matic.today/
            gasLimit: 210000,
            skipDryRun: true,
        },
    },
};

export default config;
