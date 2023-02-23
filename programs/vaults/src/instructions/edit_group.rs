use crate::constants::VAULT_AUTHORITY;
use crate::state::Mode::Halted;
use crate::state::{Group, Mode, VaultEntry};
use anchor_lang::prelude::*;
use anchor_lang::prelude::{Account, Signer};
use anchor_lang::Accounts;

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
    pub fn validate(&self, maybe_new_entries: &Option<Vec<VaultEntry>>, maybe_new_mode: &Option<Mode>) -> Result<()> {
        if let Some(new_entries) = maybe_new_entries {
            for old_entry in &self.group.adapter_infos {
                assert!(
                    new_entries.contains(old_entry),
                    "New adapters list does not contain all existing adapters!"
                );
            }

            let mut new_ratio_total: f32 = 0.0;
            for new_entry in new_entries {
                new_ratio_total += new_entry.ratio;
            }

            assert_eq!(new_ratio_total, 1.0, "Ratio does not add to 1.");
        }

        if let Some(Mode::Active) = maybe_new_mode {
            for vault in self.group.vaults {
                assert_eq!(vault.adapters.len(), self.group.adapter_infos.len(), "Vault does not have all of its adapters initialized!");
            }
        }

        Ok(())
    }

    pub fn handle(&mut self, maybe_new_entries: Option<Vec<VaultEntry>>, maybe_new_mode: Option<Mode>) -> Result<()> {
        let group = &mut self.group;

        if let Some(new_mode) = maybe_new_mode {
            group.state = new_mode;
        }

        if let Some(new_entries) = maybe_new_entries {
            group.adapter_infos = new_entries;
            group.state = Halted; // If we update the entries, require another instruction to kick the vault back on for safety
        }

        Ok(())
    }
}
