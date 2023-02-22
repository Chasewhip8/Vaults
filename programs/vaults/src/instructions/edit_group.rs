use crate::constants::VAULT_AUTHORITY;
use crate::state::Mode::Halted;
use crate::state::{Group, VaultEntry};
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
    pub fn validate(&self, vault_entries: &Vec<VaultEntry>) -> Result<()> {
        for old_entry in &self.group.adapter_infos {
            assert!(
                vault_entries.contains(old_entry),
                "New adapters list does not contain all existing adapters!"
            );
        }

        let mut new_ratio_total: f32 = 0.0;
        for new_entry in vault_entries {
            new_ratio_total += new_entry.ratio;
        }

        assert_eq!(new_ratio_total, 1.0, "Ratio does not add to 1.");

        Ok(())
    }

    pub fn handle(&mut self, vault_entries: Vec<VaultEntry>) -> Result<()> {
        let group = &mut self.group;

        group.state = Halted;
        group.adapter_infos = vault_entries;

        Ok(())
    }
}
