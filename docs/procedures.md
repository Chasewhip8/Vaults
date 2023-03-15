# Procedures
Document to outline the different procedures inside the vault to aid in implementation.

In both procedures, redemption of J-tokens will only be enabled once all vaults have `adaptes_verified` set to true, or the vault is expired.

## Initial Setup of a Vault Group and Vault
- **Step 1:** `vaults::init_group` to create the vault group for a specific `base_mint`
  - Note that in this stage the vault group has no adapters registered and is in Halted mode. Attempting to exit halted mode will fail.
- **Step 2:** `vaults::edit_group` to add adapter programs with a ratio that sums to 1.
  - Note that adapters can never be removed, only added. If any change is made to the adapter list all vaults are frozen until they are verified to have all adapters initialized by running `vaults::edit_vault`.
- **Step 3:** `vaults::init_vault` to create a vault with a new `_mint`, `start_timestamp`, and `end_timestamp`
  - This vault will have `adaptes_verified` set to false.
- **Step 4:** For each adapter program listed inside the vault group, `adapter::initialize` should be executed to set up the adapter for the vault.
- **Step 5:** `vaults::edit_vault` since `adaptes_verified` is initialized to **false**, all optional params can be left unset. If all adapter accounts are found and initialized then `adaptes_verified` will be set to **true**.

At this point the initialized vault is activated and enabled.

## Editing Vault Group Adapters
Adapters can be changed mid-cycle independent of any vault phase however all vaults will be kicked into a disabled state where 
deposits and withdraws are disabled. This is due to `adaptes_verified` being set to false. The following procedure should be 
followed to ensure no funds are misplaced.

- **Step 1:** `vaults::edit_group` to edit adapter programs with a ratio that sums to 1. All existing adapters need to remain in the list but can be set to a ratio of `0`.
- **Step 2:** For each added adapter program listed inside the vault group, `adapter::initialize` should be executed to set up the adapter for the vault.
- **Step 3:** Identify if any deposits were placed, if there are none and all vaults in the group are empty **skip to step 5**.
- **Step 4:** Determine the ratio changes between the existing adapters and redistribute the funds into the new adapters.
  - Example Scenario: Vault A and B contain 1 ETH worth $1000, the vault group is now edited to add a provider for SOL, the new vault ratios are 50% SOL and 50% ETH. 50% of the value of the existing provider needs to be converted to SOL and placed inside the SOL adapter, totalling $500 of SOL. The vault should now contain $500 worth of ETH and SOL.
- **Step 5:** Execute `vaults::edit_vault`, no optional values need to be set, to re-enable the vault.