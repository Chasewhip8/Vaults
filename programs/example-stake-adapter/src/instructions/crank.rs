use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Crank<'info> {
    payer: Signer<'info>,
}

impl<'info> Crank<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self) -> Result<u64> {
        Ok(0)
    }
}