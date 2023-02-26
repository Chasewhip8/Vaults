use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::{Account, Signer};
use solana_program::clock::UnixTimestamp;

use crate::_shared::VaultPhase::{Expired};
use crate::constants::VAULT_AUTHORITY;
use crate::state::Group;

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
        maybe_deactivated: Option<bool>,
    ) -> Result<()> {
        let group = &mut self.group;
        let vault = group.vaults.get_mut(vault_index as usize).unwrap();

        // Allow modification of the phase from expired to deactivated
        if let Some(deactivated) = maybe_deactivated {
            assert_eq!(
                vault.phase, Expired,
                "Cannot enter deactivated mode unless expired."
            );

            vault.deactivated = deactivated;
        }

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

        Ok(())
    }
}
