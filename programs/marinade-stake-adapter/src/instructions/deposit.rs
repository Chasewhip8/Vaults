use anchor_lang::prelude::*;
use crate::contexts::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    restricted: Restricted<'info>
}

impl<'info> Deposit<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self) -> Result<()> {
        Ok(())
    }
}