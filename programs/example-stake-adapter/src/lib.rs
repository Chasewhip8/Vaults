use anchor_lang::prelude::*;
use instructions::*;
use state::*;

mod instructions;
mod contexts;
mod state;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod marinade_stake_adapter {
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
    #[access_control(ctx.accounts.validate(amount))]
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<u64> {
        msg!("Entered example_stake_adapter::deposit({}) instruction", amount);
        ctx.accounts.handle(amount)
    }

    /// Instruction to handle redemptions from the vaults program, the vaults program has no idea what this program does
    ///
    /// # Arguments
    ///
    /// * `ctx`: Instruction Context
    /// * `amount`: The adapter adjusted redeem amount
    ///
    /// returns: Result<(), Error>
    #[access_control(ctx.accounts.validate(amount))]
    pub fn redeem(ctx: Context<Redeem>, amount: u64) -> Result<()> {
        msg!("Entered example_stake_adapter::redeem({}) instruction", amount);
        ctx.accounts.handle(amount)
    }

    /// Instruction to crank and return the providers balance.
    ///
    /// returns: Result<u64, Error>, where the u64 is the providers updated balance used to calculate minted receipt assets
    #[access_control(ctx.accounts.validate())]
    pub fn crank(ctx: Context<Crank>) -> Result<u64> {
        msg!("Entered example_stake_adapter::crank instruction");
        ctx.accounts.handle()
    }

    /// Transitions the adapter into a new phase
    ///
    /// returns: Result<u64, Error>, the new Phase
    #[access_control(ctx.accounts.validate())]
    pub fn edit_phase(ctx: Context<EditPhase>, new_phase: Phase) -> Result<Phase> {
        msg!("Entered example_stake_adapter::crank instruction");
        ctx.accounts.handle(new_phase) // We have no restrictions on phase change as this is a no-op adapter.
    }

    /// Instruction to initialize the provider for a vault.
    ///
    /// returns: Result<(), Error>
    #[access_control(ctx.accounts.validate())]
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Entered example_stake_adapter::initialize instruction");
        ctx.accounts.handle(*ctx.bumps.get("adapter").unwrap())
    }
}
