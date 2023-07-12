import { Wallet, getDefaultProvider, utils } from 'ethers';
import { deployContract } from '@axelar-network/axelar-local-dev';
import LockAbi from '../artifacts/contracts/Lock.sol/Lock.json';
import chains from '../chains.json';

async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    const evmChains = getEvmChains();

    const walletInit = new Wallet(process.env.PRIVATE_KEY);

    for (const chain of evmChains) {
        const provider = getDefaultProvider(chain.rpc);
        const wallet = walletInit.connect(provider);
        const lockContract = await deployContract(wallet, LockAbi, [unlockTime]);
        console.log(`${chain.name} contract address: ${lockContract.address}`);
    }
}

function getEvmChains() {
    return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
