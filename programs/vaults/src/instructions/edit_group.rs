use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::{Account, Signer};

use crate::constants::VAULT_AUTHORITY;
use crate::state::{Group, AdapterEntry};

#[derive(Accounts)]
pub struct EditGroup<'info> {
    #[account(
        mut,
        address = VAULT_AUTHORITY.key()
    )]
    authority: Signer<'info>,

    #[account(mut)]
    group: Box<Account<'info, Group>>,
}

impl<'info> EditGroup<'info> {
    pub fn validate(&self, maybe_new_entries: &Option<Vec<AdapterEntry>>) -> Result<()> {
        if let Some(new_entries) = maybe_new_entries {
            for old_entry in &self.group.adapter_infos {
                assert!(
                    new_entries.contains(old_entry),
                    "New adapters list does not contain all existing adapters!"
                );
            }

            let mut new_ratio_total= 0.0;
            for new_entry in new_entries {
                new_ratio_total += new_entry.ratio;
            }

            assert_eq!(new_ratio_total, 1.0, "Ratio does not add to 1.");
        }

        Ok(())
    }

    pub fn handle(&mut self, maybe_new_entries: Option<Vec<AdapterEntry>>) -> Result<()> {
        let group = &mut self.group;

        if let Some(new_entries) = maybe_new_entries {
            group.adapter_infos = new_entries;

            // Ensure we initialize all of the vaults new adapters before we transition from Halted.
            for vault in self.group.vaults.iter_mut() {
                vault.adapters_verified = false;
            }
        }

        Ok(())
    }
}
