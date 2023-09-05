import { Wallet, getDefaultProvider, BigNumber, ethers } from 'ethers';
import Lock from '../artifacts/contracts/Lock.sol/Lock.json';
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

        const salt = ethers.utils.hexZeroPad(BigNumber.from(169), 32);

        // const deployedAddress = await deployerContract.callStatic.deployAndInit(Lock.bytecode, salt, initData);
        const creationCode = ethers.utils.solidityPack(
            ['bytes', 'bytes'],
            [Lock.bytecode, ethers.utils.defaultAbiCoder.encode(['uint256'], [unlockTime])]
        );
        const deployedAddress = await deployerContract.callStatic.deploy(creationCode, salt);

        console.log(`${chain.name}, address: ${deployedAddress}`);
    }
}

// function encodeConstructor() {
//     const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//     const unlockTime = currentTimestampInSeconds + 60;

//     // Encode the function call
//     // const initFunction = 'intialize(uint256)';
//     const initFunction = 'constructor(uint256)';
//     const initData = ethers.utils.defaultAbiCoder.encode(['uint256'], [unlockTime]);
//     const initSignature = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(initFunction)).slice(0, 10);

//     // Remove 0x
//     return initSignature + initData.substring(2);
// }

function getEvmChains() {
    return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
