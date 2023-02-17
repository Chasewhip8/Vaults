use anchor_lang::prelude::*;
use lib_adapter::Deposit;

pub trait DepositHandler {
    fn validate(&self) -> Result<()>;

    fn handle(&mut self) -> Result<()>;
}

impl<'info> DepositHandler for Deposit<'info> {
    fn validate(&self) -> Result<()> {
        todo!()
    }

    fn handle(&mut self) -> Result<()> {
        todo!()
    }
}