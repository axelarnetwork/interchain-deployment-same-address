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

    const gasLimit = 2000000; // Set a suitable gas limit value
    const maxFeePerGas = ethers.utils.parseUnits("100", "gwei"); // Set a suitable maxFeePerGas value
    const maxPriorityFeePerGas = ethers.utils.parseUnits("1", "gwei"); // Set a suitable maxPriorityFeePerGas value

    const overrides = {
      gasLimit,
      maxFeePerGas,
      maxPriorityFeePerGas,
    };

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
      ethers.utils.hexZeroPad(BigNumber.from(222), 32),
      encodedInitData,
      overrides
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
