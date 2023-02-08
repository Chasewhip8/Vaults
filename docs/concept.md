# Vaults

## The Great Idea
Different programs on Solana provide ways for users to deposit their assets and receive yield over time. The downside to doing
this is that the assets are locked inside that contract until withdrawn. Vaults will provide an intermediate layer between these
programs in which the user will deposit and receive two tokens. A J-Token representing the deposited asset, and an I-Token 
which will represent the yield the vault has accrued so far.

Each vault will run for a predetermined time and at the end of the cycle the J-Tokens will be redeemable 1 to 1 with the deposited
assets. And the I-Tokens will be redeemable for the yield generated. However, at any point while the vault is active a user can 
withdraw by combining a J-Token with an I-Token.

## Architecture Layout
```
                            Vault Program
        _________________________|_______________________
        |                        |                      |
  Adapter Program          Adapter Program        Adapter Program
        |                        |                      |
Third Party Platform    Third Party Platform    Third Party Platform
```

### Third Party Platform
Programs such as Raydium Staking, Quarry and other third party services that generate some form of yield.

### Adapter Program
Provides a standardized instruction set of gated instructions to the Vault Program, abstracting away the implementation
of the third party platform.

### Vault Program
The main program which controls the main vault cycle and synchronizing all the provider programs for each vault. Users will
interact with this program. They will receive two recipe tokens for deposits, one representing the underlying asset, and the 
other representing the yield the vault generates.

## Data and Account Layout
We will start by defining the PDA's and data structs needed in the entre system,

### Adapter 
`owner: Adapter Program`

| Name               | Type                      | Description                             |
|--------------------|---------------------------|-----------------------------------------|
| `internal_phase`   | [VaultPhase](#VaultPhase) | Internal phase of yield provider        |
| `provider_balance` | u64                       | Balance of all asset deposits and yield |

### Group
`owner: Vault Program`

| Name            | Type                           | Description                                     |
|-----------------|--------------------------------|-------------------------------------------------|
| `adapter_infos` | Vec<[VaultEntry](#VaultEntry)> | List of allowed providers where ratio adds to 1 |
| `vaults`        | Vec<[Vault](#Vault)>           | List of vaults                                  |
| `j_mint`        | Pubkey                         | Mint of J token                                 |

## Structs and Enums
### VaultPhase
 - `Active`
 - `PendingExpired` (only entered by vault provider)
 - `Expirec`
 - `PendingActive` (only entered by vault provider)
 - `Deactivated`

### Vault
| Name              | Type                      | Description                                    |
|-------------------|---------------------------|------------------------------------------------|
| `owner`           | Pubkey                    | Public key of group which the vault belongs to |
| `adapters`        | Vec<Pubkey>               | List of [adapter](#Adapter) account pubkeys    |
| `i_mint`          | Pubkey                    | Mint of I token                                |
| `phase`           | [VaultPhase](#VaultPhase) | Phase of yield provider                        |
| `start_timestamp` | i64                       | Active Phase start timestamp                   |
| `end_timestamp`   | i64                       | Active Phase end timestamp                     |

### VaultEntry
| Name      | Type   | Description                         |
|-----------|--------|-------------------------------------|
| `adapter` | Pubkey | Allowed adapter program public keys |
| `ratio`   | f32    | Ratio of vault.                     |

## Technical Implementation
Each vault group will consist of a list of providers of which are associated with a ratio of their 
composition in the vault. Since this ratio is used for deposit and withdrawals it cannot be changed once
the vault has been created. An admin will be denoted inside the vault group which has access to create new vaults and 
adjust the timestamps of each vault.

Each provider will keep track of its individual deposits and yield it has accrued over time. This abstraction
allows for us to make providers for non-single sided staking strategy's, think Kamino strategies. One thing to keep
in mind is that the provider will need to be cranked on deposit/withdraw or cranked continuously for auto compounding
to update the balance noted inside its pda. This puts the restriction of the provider needing to be able to figure out
how many assets it holds and how much has been made, or lost.

One key design consideration is that we are going to give the responsibility of issuing transfers to the provider, since
versioned transactions are a thing now this should be of no concern. What that does do however, is allow for a single provider to accept
multiple different assets, at the same time. The controller will only need to ensure that each deposit instruction for each provider
was successful, if one fails all of them do. This also applies similarly to withdrawals.

As alluded to in the previous paragraph we are going to put a ton of faith in each of providers and the vault group admin will need
to ensure that each provider is secure and trustable.