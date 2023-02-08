use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_lang::prelude::{Account, Signer};
use crate::constants::VAULT_AUTHORITY;
use crate::state::Group;

#[derive(Accounts)]
pub struct EditVault<'info> {
    #[account(
        mut,
        address = VAULT_AUTHORITY.key().as_ref()
    )]
    authority: Signer<'info>,

    #[account(mut)]
    group: Box<Account<'info, Group>>,
}

impl<'info> EditVault<'info> {
    pub fn validate(self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self) -> Result<()> {
        Ok(())
    }
}