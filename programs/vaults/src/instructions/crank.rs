use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Crank<'info> {
    
}

impl<'info> Crank<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, accounts: &[AccountInfo<'info>]) -> Result<()> {
        Ok(())
    }
}