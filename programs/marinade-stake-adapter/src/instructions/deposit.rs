use anchor_lang::prelude::*;
use adapter::{deposit_ctx, IDeposit};

deposit_ctx!();

impl <'info> IDeposit for Deposit<'info> {
    fn validate(&self) -> Result<()> {
        todo!()
    }

    fn handle(&mut self) -> Result<()> {
        todo!()
    }
}