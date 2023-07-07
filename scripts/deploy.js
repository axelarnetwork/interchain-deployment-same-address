const { Wallet, getDefaultProvider } = require("ethers");
const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");
const LockAbi = requre("../artifacts/contracts/Lock.sol/Lock.json");

const hre = require("hardhat");

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  // const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
  //   value: lockedAmount,
  // });
  const provider = getDefaultProvider(chain.rpc);
  const wallet = walletInit.connect(provider);

  const myContract = await deployContract(wallet, SendAck, [
    chain.gateway,
    chain.gasReceiver,
  ]);

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
