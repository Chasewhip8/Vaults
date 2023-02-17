use anchor_lang::prelude::*;
use instructions::*;
use lib_adapter::*;

mod instructions;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod marinade_stake_adapter {
    use super::*;

    pub fn deposit(
        ctx: Context<Deposit>
    ) -> Result<()> {
        ctx.accounts.handle()
    }
}