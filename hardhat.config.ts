import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import chains from './chains.json';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: '0.8.18',
    networks: {
        polygon: {
            url: chains[0].rpc,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            chainId: 80001,
        },
        avalanche: {
            url: chains[1].rpc,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            chainId: 43113,
        },
    },
};

export default config;
