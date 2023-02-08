mod instructions;
mod state;
mod constants;

use instructions::*;
use anchor_lang::prelude::*;
use solana_program::clock::UnixTimestamp;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// Controller
#[program]
pub mod vaults {
    use super::*;

    pub fn init_group(ctx: Context<InitGroup>) -> Result<()> {
        ctx.accounts.handle()
    }

    #[access_control(ctx.accounts.validate(start_timestamp, end_timestamp))]
    pub fn init_vault(
        ctx: Context<InitVault>,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp, ctx.remaining_accounts)
    }

    #[access_control(ctx.accounts.validate())]
    pub fn edit_vault(
        ctx: Context<InitVault>,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp, ctx.remaining_accounts)
    }
}
