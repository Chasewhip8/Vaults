use anchor_lang::prelude::*;
use instructions::*;

mod instructions;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod marinade_stake_adapter {
    use super::*;

    pub fn deposit(ctx: Context<Deposit>) -> Result<()> {
        Ok(())
    }
}
