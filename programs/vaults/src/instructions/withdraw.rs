use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::Signer;

#[derive(Accounts)]
pub struct Withdraw<'info> {
    authority: Signer<'info>,
}

impl<'info> Withdraw<'info> {
    pub fn validate(&self, amount: u64, accounts: &[AccountInfo]) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, amount: u64, accounts: &[AccountInfo], adapter_accounts: Vec<u8>) -> Result<()> {
        Ok(())
    }
}
