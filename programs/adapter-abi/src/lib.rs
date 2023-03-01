pub mod contexts;
pub mod constants;

pub use crate::contexts::*;
pub use crate::constants::*;

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod adapter_abi {
    use super::*;

    /// Instruction to handle deposits from the vaults program, the vaults program has no idea what this program does
    /// except for it's return value.
    ///
    /// # Arguments
    ///
    /// * `ctx`: Instruction Context
    /// * `amount`: The adapter adjusted deposit amount, aka total_deposit * ratio
    ///
    /// returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets
    pub fn deposit(ctx: Context<IDeposit>, amount: u64) -> Result<u64> {
        msg!("Entered adapter_abi::deposit({}) instruction, returning fake value of 1", amount);
        Ok(1)
    }

    /// Instruction to handle redemptions from the vaults program, the vaults program has no idea what this program does
    ///
    /// # Arguments
    ///
    /// * `ctx`: Instruction Context
    /// * `amount`: The adapter adjusted redeem amount
    ///
    /// returns: Result<(), Error>, where the u64 is the providers updated balance used to calculate minted receipt assets
    pub fn redeem(ctx: Context<IRedeem>, amount: u64) -> Result<()> {
        msg!("Entered adapter_abi::redeem({}) dummy instruction", amount);
        Ok(())
    }

    /// Instruction to crank and return the providers balance.
    ///
    /// returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets
    pub fn crank(ctx: Context<ICrank>) -> Result<u64> {
        msg!("Entered adapter_abi::crank dummy instruction");
        Ok(1)
    }
}
