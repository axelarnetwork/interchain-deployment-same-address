# Multichain Deployment

Execute the deploy script to be able to deploy the Greeter contract on both the Avalanche and the Polygon blockchains.

## How to run

1. Clone the repo
2. Update the .env files to include
   - Your private key
   - RPC key for mumbai and avalanche
3. Run the command `hh run scripts/deploy.ts`

## Expect Output

The output should be as follows:

```
Mumbai contract address: 0xA64092330c3f730D7C1518Ed8417a23b9c61C7FF
Avalanche contract address: 0xA64092330c3f730D7C1518Ed8417a23b9c61C7FF
```

Note: The address you see will not be the same as this address. As long as the two addresses you are seeing are the same on both blockchains

## Potential Bugs:

- Gas: Make sure your address who's private key you are referencing has enough gas to deploy the contract on both chains
- Nonce: If the address is deploying but the addresses are different your nonce may be out of sync for the two blockchains
