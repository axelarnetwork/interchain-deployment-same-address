const { Wallet, getDefaultProvider } = require("ethers");
const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");
const LockAbi = require("../artifacts/contracts/Lock.sol/Lock.json");
const chains = require("../chains.json");

const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const chains = getEvmChains();

  const walletInit = new Wallet(process.env.PRIVATE_KEY);

  chains.map(async (chain) => {
    const provider = getDefaultProvider(chain.rpc);
    console.log(provider, "provider");
    const wallet = walletInit.connect(provider);
    console.log(wallet.address);
    const lockContract = await deployContract(wallet, LockAbi, [unlockTime]);
    console.log(lockContract.address);
  });

  // console.log(
  //   `Lock with ${ethers.formatEther(
  //     lockedAmount
  //   )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  // );
}

function getEvmChains() {
  return chains.map((chain) => ({
    ...chain,
  }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
