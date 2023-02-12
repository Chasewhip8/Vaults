use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_lang::prelude::{Account, Signer};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    depositor: Signer<'info>
}

impl<'info> Withdraw<'info> {
    pub fn validate(self, accounts: &[AccountInfo]) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, accounts: &[AccountInfo]) -> Result<()> {
        Ok(())
    }
}