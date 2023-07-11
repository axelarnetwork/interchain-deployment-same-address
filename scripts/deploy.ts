import { Wallet, getDefaultProvider, ethers, BigNumber } from "ethers";
import Lock from "../artifacts/contracts/Lock.sol/Lock.json";
import ConstAddressDeployer from "../node_modules/@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/deploy/ConstAddressDeployer.sol/ConstAddressDeployer.json";
import chains from "../chains.json";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;
  const unlockTimeBytes = ethers.utils.hexZeroPad(
    ethers.utils.hexlify(unlockTime),
    32
  );

  const evmChains = getEvmChains();
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "Invalid private key. Make sure PRIVATE_KEY environment variable is set."
    );
  }

  const AddressDeployerAddr = "0x98b2920d53612483f91f12ed7754e51b4a77919e";

  for (const chain of evmChains) {
    const wallet = new Wallet(privateKey);
    const provider = getDefaultProvider(chain.rpc);
    const connectedWallet = wallet.connect(provider);

    const deployerContract = new ethers.Contract(
      AddressDeployerAddr,
      ConstAddressDeployer.abi,
      connectedWallet
    );

    // Encode the function call
    const initFunction = "initialize(uint256)";
    const initData = ethers.utils.defaultAbiCoder.encode(
      ["uint256"],
      [unlockTime]
    );
    const initSignature = ethers.utils
      .keccak256(ethers.utils.toUtf8Bytes(initFunction))
      .slice(0, 10); // Get the function selector

    const encodedInitData = initSignature + initData.substring(2); // Remove the function selector "0x"

    const deployedAddr = await deployerContract.deployAndInit(
      Lock.bytecode,
      ethers.utils.hexZeroPad(BigNumber.from(225), 32),
      encodedInitData
    );
    const receipt = await deployedAddr.wait();
    console.log(receipt.events[0].args.deployedAddress, "the log");
  }
}

function getEvmChains() {
  return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
