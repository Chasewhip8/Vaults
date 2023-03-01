use std::borrow::Borrow;
use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::{Account, Signer};
use solana_program::clock::UnixTimestamp;

use crate::constants::VAULT_AUTHORITY;
use crate::state::Group;
use crate::state::VaultPhase::Expired;

#[derive(Accounts)]
pub struct EditVault<'info> {
    #[account(
        mut,
        address = VAULT_AUTHORITY.key()
    )]
    authority: Signer<'info>,

    #[account(mut)]
    group: Box<Account<'info, Group>>,
}

impl<'info> EditVault<'info> {
    pub fn handle_and_validate(
        &mut self,
        vault_index: u8,
        maybe_new_start_timestamp: Option<UnixTimestamp>,
        maybe_new_end_timestamp: Option<UnixTimestamp>,
        accounts: &[AccountInfo<'info>]
    ) -> Result<()> {
        let group = &mut self.group;
        let vault = group.vaults.get_mut(vault_index as usize).unwrap();

        if let Some(new_start_timestamp) = maybe_new_start_timestamp {
            assert_eq!(
                vault.phase, Expired,
                "Cannot edit start timestamp while active."
            );

            vault.start_timestamp = new_start_timestamp;
        }

        if let Some(new_end_timestamp) = maybe_new_end_timestamp {
            vault.end_timestamp = new_end_timestamp;
        }

        // Assert timestamps are valid
        assert!(
            vault.start_timestamp < vault.end_timestamp,
            "Vault timestamps cannot be out of order."
        );

        if !vault.adapters_verified {
            msg!("Verifying Adapters");
            vault.adapters_verified = true; // Set up here to allow borrow checker to release vaults reference.

            assert_eq!(accounts.len(), group.adapter_infos.len(), "Incorrect amount of adapters to verify!");

            for (index, adapter_info) in group.adapter_infos.iter().enumerate() {
                let expected_account = Pubkey::create_program_address(
                    &[
                        b"Adapter",
                        vault.i_mint.as_ref()
                    ],
                    &adapter_info.adapter
                ).unwrap();

                let account = accounts.get(index).unwrap();

                assert_eq!(account.key(), expected_account, "Expected adapter account address mismatch, maybe wrong order?");
                assert_eq!(account.owner.key(), adapter_info.adapter, "Adapter owner mismatch!"); // Most likely redundant but why not.
            }

            msg!("Verified Adapters!");
        }

        Ok(())
    }
}
