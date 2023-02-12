mod instructions;
mod state;
mod constants;

use instructions::*;
use anchor_lang::prelude::*;
use solana_program::clock::UnixTimestamp;
use crate::state::VaultEntry;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

// Controller
#[program]
pub mod vaults {
    use super::*;

    pub fn init_group(ctx: Context<InitGroup>) -> Result<()> {
        ctx.accounts.handle()
    }

    #[access_control(ctx.accounts.validate(&new_entries))]
    pub fn edit_group(
        ctx: Context<EditGroup>,
        new_entries: Vec<VaultEntry>
    ) -> Result<()> {
        ctx.accounts.handle(new_entries)
    }

    #[access_control(ctx.accounts.validate(start_timestamp, end_timestamp))]
    pub fn init_vault(
        ctx: Context<InitVault>,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp,
        providers: Vec<Pubkey>
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp, providers)
    }

    pub fn edit_vault(
        ctx: Context<EditVault>,
        vault_index: u8,
        new_start_timestamp: Option<UnixTimestamp>,
        new_end_timestamp: Option<UnixTimestamp>
    ) -> Result<()> {
        ctx.accounts.handle_and_validate(vault_index, new_start_timestamp, new_end_timestamp)
    }

    #[access_control(ctx.accounts.validate(ctx.remaining_accounts))]
    pub fn deposit(
        ctx: Context<Deposit>
    ) -> Result<()> {
        ctx.accounts.handle(ctx.remaining_accounts)
    }

    #[access_control(ctx.accounts.validate(ctx.remaining_accounts))]
    pub fn withdraw(
        ctx: Context<Withdraw>
    ) -> Result<()> {
        ctx.accounts.handle(ctx.remaining_accounts)
    }
}
