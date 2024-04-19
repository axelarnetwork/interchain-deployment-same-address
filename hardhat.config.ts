import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/types';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import chains from './chains.json';

dotenv.config();

const config: HardhatUserConfig = {
    solidity: '0.8.18',
    networks: {
        celo: {
            url: chains[0].rpc,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            chainId: chains[0].chainId,
        },
        fantom: {
            url: chains[1].rpc,
            accounts: [`0x${process.env.PRIVATE_KEY}`],
            chainId: chains[1].chainId,
        },
    },
};

export default config;
