pub mod contexts;
pub mod constants;

pub use crate::contexts::*;
pub use crate::constants::*;

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod adapter_abi {
    use super::*;

    pub fn deposit(ctx: Context<IDeposit>) -> Result<()> {
        Ok(())
    }
}
