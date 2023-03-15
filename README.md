# Seagull Finance: Vaults (DeFi / University Track)
Unlocking capital efficiency and speculation markets via a new class of derivatives only possible on Solana.

## How it Works
Please read the design documentation which outlines the concept and terminology [here](https://github.com/Chasewhip8/Vaults/blob/master/docs/concept.md).

The TL;DR is: Vaults is an asset-agnostic, multi-asset liquid staking vault that mints two tokens upon deposit - one representing the yield accrued over the lifespan of the vault and another representing the underlying staked asset. Users can buy Yield tokens if they suspect the yield to increase over the lifespan of the vault. Alternatively, if a user is interested in acquiring a large spot position, they can acquire base asset tokens at a discount.

Now that you have a basic understanding, let's review a few of the technical hurdles we have overcome. Due to the modular nature of the protocol, we needed to design a way to define an interface that other programs could implement. We accomplished this by using the Anchors CPI crate with a sacrificial adapter_abi program. This allows our main program to call functions on the fake program via anchor generated methods, except with a different program ID. However, this does not resolve the issue of needing to know the accounts of the adapter programs.

Our solution is as follows: we pass in the extra required accounts through Anchors' remaining_accounts field and supply a Vec<Vec<u8>> as instruction data to the program. At runtime, we ensure that the program ID passed in is known and then assemble the accounts on the fly via these indexes. This approach moves the account details outside of the program and onto the SDK. As a result, the SDK can assemble the accounts and calculate the appropriate index data.

To learn more about our technical implementation, please refer to our [docs'](https://github.com/Chasewhip8/Vaults/tree/master/docs) directory.

## Setup
Run the following commands to set up the repository once you have cloned it locally.
```
git submodule update --init --recursive
```

## Building
To build programs run
```
anchor build
```
at the top level, this will build the adapter, copy it, and run `anchor build`

A similar command is available for `test`
