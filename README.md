# Seagull Finance: Vaults
Unlocking capital efficiency and speculation markets via a new class of derivatives only possible on Solana.

## Technical Information
Learn more about our technical implementation in our [docs'](https://github.com/Chasewhip8/Vaults/tree/master/docs) directory.

More specifically we would recommend you read about the [concept](https://github.com/Chasewhip8/Vaults/blob/master/docs/concept.md) of our protocol.

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
