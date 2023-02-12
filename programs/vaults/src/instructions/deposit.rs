use anchor_lang::prelude::*;
use anchor_lang::Accounts;
use anchor_lang::prelude::{Signer};

#[derive(Accounts)]
pub struct Deposit<'info> {
    depositor: Signer<'info>
}

impl<'info> Deposit<'info> {
    pub fn validate(self, accounts: &[AccountInfo]) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, accounts: &[AccountInfo]) -> Result<()> {
        Ok(())
    }
}