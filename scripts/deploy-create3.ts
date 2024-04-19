import { Wallet, getDefaultProvider, BigNumber, ethers } from 'ethers';
import LockCreate3 from '../artifacts/contracts/LockCreate3.sol/LockCreate3.json';
import Create3Deployer from '@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/deploy/Create3Deployer.sol/Create3Deployer.json';
import chains from '../chains.json';

const CREATE_3_DEPLOYER = '0xf49B10ccFB7D82C3a8749fFB1aAF3e0c936Eba36';

async function main() {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('Invalid private key. Make sure the PRIVATE_KEY environment variable is set.');
    }

    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    const evmChains = getEvmChains();

    for (const chain of evmChains) {
        const wallet = new Wallet(privateKey);
        const provider = getDefaultProvider(chain.rpc);
        const connectedWallet = wallet.connect(provider);

        const deployerContract = new ethers.Contract(CREATE_3_DEPLOYER, Create3Deployer.abi, connectedWallet);

        const salt = ethers.utils.hexZeroPad(BigNumber.from(888).toHexString(), 32);

        const creationCode = ethers.utils.solidityPack(
            ['bytes', 'bytes'],
            [LockCreate3.bytecode, ethers.utils.defaultAbiCoder.encode(['uint256', 'address'], [unlockTime, wallet.address])]
        );
        const deployedAddress = await deployerContract.callStatic.deploy(creationCode, salt);

        console.log(`${chain.name}, address: ${deployedAddress}`);
    }
}

function getEvmChains() {
    return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
