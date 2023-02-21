use anchor_lang::prelude::*;

pub mod state;
mod shared;

use state::*;
use shared::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod lib_adapter {
    use super::*;

    pub fn deposit(
        ctx: Context<IDeposit>
    ) -> Result<()> {
        Err(error!(LibAdapterError::NotImplemented))
    }
}

#[error_code]
pub enum LibAdapterError {
    #[msg("This is an interface, it is not implemented!")]
    NotImplemented,
}