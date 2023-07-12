import { Wallet, getDefaultProvider, BigNumber, ethers } from 'ethers';
import Lock from '../artifacts/contracts/LockInit.sol/LockInit.json';
import ConstAddressDeployer from '@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/deploy/ConstAddressDeployer.sol/ConstAddressDeployer.json';
import chains from '../chains.json';

const CONST_ADDRESS_DEPLOYER_ADDR = '0x98b2920d53612483f91f12ed7754e51b4a77919e';

async function main() {
    const privateKey = process.env.PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('Invalid private key. Make sure the PRIVATE_KEY environment variable is set.');
    }

    const initData = encodeInitData();
    const evmChains = getEvmChains();

    for (const chain of evmChains) {
        const wallet = new Wallet(privateKey);
        const provider = getDefaultProvider(chain.rpc);
        const connectedWallet = wallet.connect(provider);

        const deployerContract = new ethers.Contract(CONST_ADDRESS_DEPLOYER_ADDR, ConstAddressDeployer.abi, connectedWallet);

        //salt (make sure this salt has not been used already)
        const salt = ethers.utils.hexZeroPad(BigNumber.from(11), 32);

        const deployedAddr = await deployerContract.deployAndInit(Lock.bytecode, salt, initData);
        const receipt = await deployedAddr.wait();

        console.log(`${chain.name}, address: ${receipt.events[0].args.deployedAddress}`);
    }
}

function encodeInitData() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;

    // Encode the function call
    const initFunction = 'initialize(uint256)';
    const initData = ethers.utils.defaultAbiCoder.encode(['uint256'], [unlockTime]);
    const initSignature = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(initFunction)).slice(0, 10);

    // Remove 0x
    return initSignature + initData.substring(2);
}

function getEvmChains() {
    return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
