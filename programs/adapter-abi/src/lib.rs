pub mod contexts;
pub mod constants;
pub mod state;

pub use crate::contexts::*;
pub use crate::constants::*;
pub use crate::state::*;

use anchor_lang::prelude::*;

declare_id!("26UqMok72V1y2gAkUfwsA14twZmFdFnVREgFM7x8jVvr");

#[program]
#[allow(unused_variables)]
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
    pub fn deposit(ctx: Context<Restricted>, amount: u64) -> Result<u64> {
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
    /// returns: Result<(), Error>
    pub fn redeem(ctx: Context<Restricted>, amount: u64) -> Result<()> {
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

    /// Transitions the adapter into a new phase
    ///
    /// returns: Result<u64, Error>, the new Phase
    pub fn edit_phase(ctx: Context<Restricted>, new_phase: Phase) -> Result<Phase> {
        msg!("Entered adapter_abi::crank dummy instruction");
        Ok(new_phase)
    }
}
