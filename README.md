# Interchain Deployment

Execute the deploy script to be able to deploy the Greeter contract on both the Celo and the Fantom blockchains.

## How to run

1. Clone the repo
2. Update the .env files to include
    - Your private key
    - RPC key for celo and fantom
3. Install dependencies
    - `npm i`
    NOTE: In case of ethers versioning issue run `npm i --legacy-peer-deps` 
4. Run the deploy script
    - Nonce Deployment: `hh run scripts/deploy-with-nonce.ts`
    - Create2 Deployment: `hh run scripts/deploy-create2.ts`
    - Create3 Deployment: `hh run scripts/deploy-create3.ts`

## Expect Output

An example of the output should be as follows:

```
Celo contract address: 0xA64092330c3f730D7C1518Ed8417a23b9c61C7FF
Fantom contract address: 0xA64092330c3f730D7C1518Ed8417a23b9c61C7FF
```

Note: The address you see will not be the same as this address. As long as the two addresses you are seeing are the same on both blockchains then the code is working correctly!

## Potential Bugs:

-   Gas:
    -   Make sure your address who's private key you are referencing has enough gas to deploy the contract on both chains
-   Nonce:
    -   If the address is deploying but the addresses are different your nonce may be out of sync for the two blockchains.
    -   The way to check the nonce for your address is by using ethers in the cli.
        1. To do so run: `hh console --network celo` (change the flag to fantom for checking fantom)
        2. Run `await ethers.provider.getTransactionCount("YOUR_ADDRESS")`
        3. Compare the nonce count for both networks. If they are different simply execute a tx one the blockchain with a lower nonce. Continue executing txs until the nonces on both blockchains are the same. Once they are the same re-run the deploy script.
