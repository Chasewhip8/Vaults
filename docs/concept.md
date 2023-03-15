# Vaults

## The Great Idea
Seagull Vaults is an intermediate layer between different yield-generating programs on Solana. Users can deposit and receive two tokens: a Base-Token representing the deposited asset, and a Yield-Token representing the yield the vault has generated.

At the end of the predetermined vault cycle, users can redeem Base-Tokens for their deposited assets and Yield-Tokens for the generated yield. However, users can withdraw at any time while the vault is active by combining both tokens.

## Architecture Layout
```
                            Vault Program
        _________________________|_______________________
        |                        |                      |
  Adapter Program          Adapter Program        Adapter Program
        |                        |                      |
Third Party Protocol    Third Party Protocol    Third Party Protocol
```

## Third Party Protocol
Programs such as Raydium Staking, Quarry, Kamino, LSD's, Solend and other third party services that generate some form of yield.

## Adapter Program
Provides a standardized instruction set of gated instructions to the Vault Program, abstracting away the implementation of the third-party platform.

## Vault Program
The main program that controls the main vault cycle and synchronizes all the provider programs for each vault. Users interact with this program.

## Technical Implementation
Each vault group will consist of a list of providers, and each provider will be associated with a ratio of their composition in the vault. The asset ratio can be changed even after the vault has been created. An admin, designated inside the vault group, will have access to create new vaults and modify the timestamps of each vault.

Each provider will keep track of its individual deposits and yield it has accrued over time. This abstraction allows for us to make providers for non-single sided staking strategies, such as Kamino strategies. One thing to keep in mind is that the provider will need to be cranked on deposit/withdraw or cranked continuously for auto compounding to update the balance noted inside its PDA. This puts the restriction of the provider needing to be able to figure out how many assets it holds and how much has been made, or lost.

One key design consideration is that we are going to give the responsibility of issuing transfers to the provider, since versioned transactions are a thing now, this should be of no concern. What that does do, however, is allow for a single provider to accept multiple different assets at the same time. The controller will only need to ensure that each deposit instruction for each provider was successful. If one fails, all of them will fail. This also applies similarly to withdrawals.

As alluded to in the previous paragraph, we are going to put a ton of faith in each of the providers, and the vault group admin will need to ensure that each provider is secure and trustable.