import { Wallet, getDefaultProvider } from "ethers";
import { utils } from "@axelar-network/axelar-local-dev";
import LockAbi from "../artifacts/contracts/Lock.sol/Lock.json";
import chains from "../chains.json";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const evmChains = getEvmChains();
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey) {
    throw new Error("Invalid private key. Make sure PRIVATE_KEY environment variable is set.");
  }

  const wallet = new Wallet(privateKey);

  for (const chain of evmChains) {
    const provider = getDefaultProvider(chain.rpc);
    const connectedWallet = wallet.connect(provider);
    const lockContract = await utils.deployContract(connectedWallet, LockAbi, [unlockTime]);
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
