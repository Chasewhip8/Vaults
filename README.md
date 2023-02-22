# Vaults V2

## Setup
Run the following commands to set up the repository once you have cloned it locally.
```
git submodule update --init --recursive
```
Install cargo-make if you have not already.
```
cargo install --force cargo-make
```

## Building
To build programs run
```
cargo make build
```
at the top level, this will build the adapter, copy it, and run `anchor build`

A similar command is available for `test`