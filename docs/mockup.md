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
