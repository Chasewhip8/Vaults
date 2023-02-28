mod state;
mod contexts;

use anchor_lang::prelude::*;
use contexts::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod adapter_abi {
    use super::*;

    pub fn deposit(ctx: Context<IDeposit>) -> Result<()> {
        Ok(())
    }
}
