# Vaults
## Architecture Layout
```
                             Controller
        _________________________|_______________________
        |                        |                      |
   Yeild Provider          Yeild Provider         Yeild Provider
        |                        |                      |
Third Party Platform    Third Party Platform    Third Party Platform
```

### Third Party Platform
Third party programs such as Raydium, Quarry, or another program which can provide deterministic deposit,
withdraw, and generates yield.

### Yield Provider
Provides the controller with a standardized interface to interact with and manage assets. This provides
an abstraction layer which allows for moving the business logic of the vault outside the platform integration.

All functions are gated and can only be invoked by the parent Controller.

### Controller
The main vault program which houses the business logic for tracking deposits and withdrawals of assets in addition to
managing the lifecycle of all underlying yield providers. A recipe token will be minted for the underlying asset representation
and another for the yield it has generated. Deposits into currently running vaults will return a ratio of the underlying asset
and its yield token to maintain the deposit ratio.

## Data and Account Layout
We will start by defining the PDA's and data structs needed in the entre system,

### Provider 
`owner: Yield Provider`

| Name               | Type                      | Description                             |
|--------------------|---------------------------|-----------------------------------------|
| `internal_phase`   | [VaultPhase](#VaultPhase) | Internal phase of yield provider        |
| `provider_balance` | u64                       | Balance of all asset deposits and yield |

### Group
`owner: Controller`

| Name             | Type                           | Description                                     |
|------------------|--------------------------------|-------------------------------------------------|
| `providers_info` | Vec<[VaultEntry](#VaultEntry)> | List of allowed providers where ratio adds to 1 |
| `vaults`         | Vec<[Vault](#Vault)>           | List of vaults                                  |
| `j_mint`         | Pubkey                         | Mint of J token                                 |

## Structs and Enums
### VaultPhase
 - `ACTIVE`
 - `PendingExpired` (only entered by vault provider)
 - `EXPIRED`
 - `PENDING_ACTIVE` (only entered by vault provider)

### Vault
| Name              | Type                      | Description                                    |
|-------------------|---------------------------|------------------------------------------------|
| `owner`           | Pubkey                    | Public key of group which the vault belongs to |
| `providers`       | Vec<Pubkey>               | List of [provider](#Provider) account pubkeys  |
| `i_mint`          | Pubkey                    | Mint of I token                                |
| `phase`           | [VaultPhase](#VaultPhase) | Phase of yield provider                        |
| `start_timestamp` | i64                       | Active Phase start timestamp                   |
| `end_timestamp`   | i64                       | Active Phase end timestamp                     |

### VaultEntry
| Name       | Type   | Description                          |
|------------|--------|--------------------------------------|
| `provider` | Pubkey | Allowed provider program public keys |
| `ratio`    | f32    | Ratio of vault.                      |

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
