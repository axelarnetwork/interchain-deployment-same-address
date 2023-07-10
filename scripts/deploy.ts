import { Wallet, getDefaultProvider } from "ethers";
import { utils } from "@axelar-network/axelar-local-dev";
import LockAbi from "../artifacts/contracts/Lock.sol/Lock.json";
import ConstAddressDeployer from "../node_modules/@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/deploy/ConstAddressDeployer.sol/ConstAddressDeployer.json";
import chains from "../chains.json";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const evmChains = getEvmChains();
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error(
      "Invalid private key. Make sure PRIVATE_KEY environment variable is set."
    );
  }

  const AddressDeployerAddr = "0x98b2920d53612483f91f12ed7754e51b4a77919e";

  for (const chain of evmChains) {
    // const lockContract = await utils.deployContract(connectedWallet, LockAbi, [unlockTime]);
    // console.log(`${chain.name} contract address: ${lockContract.address}`);
    const wallet = new Wallet(privateKey);
    const provider = getDefaultProvider(chain.rpc);
    const connectedWallet = wallet.connect(provider);

    const greetingMessagesContract = new ethers.Contract(
      AddressDeployerAddr,
      ConstAddressDeployer.abi,
      connectedWallet
    );

    const deployedAddr = await greetingMessagesContract.deploy(
      ConstAddressDeployer.bytecode,
      ethers.utils.hexZeroPad(ethers.BigNumber.from(7), 32)
    );
    const receipt = await deployedAddr.wait();
    console.log(receipt.events[0].args, "the log");
  }
}

function getEvmChains() {
  return chains.map((chain) => ({ ...chain }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
