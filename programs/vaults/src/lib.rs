mod _shared;
mod constants;
mod cpis;
mod instructions;
mod state;
mod adapter;

use crate::state::VaultEntry;
use crate::state::Mode;
use anchor_lang::prelude::*;
use instructions::*;
use solana_program::clock::UnixTimestamp;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vaults {
    use crate::state::Mode;
    use super::*;

    #[access_control(ctx.accounts.validate())]
    pub fn init_group(ctx: Context<InitGroup>) -> Result<()> {
        ctx.accounts.handle()
    }

    #[access_control(ctx.accounts.validate(&maybe_new_entries, &maybe_new_mode, ctx.remaining_accounts))]
    pub fn edit_group(
        ctx: Context<EditGroup>,
        maybe_new_entries: Option<Vec<VaultEntry>>,
        maybe_new_mode: Option<Mode>
    ) -> Result<()> {
        ctx.accounts.handle(maybe_new_entries, maybe_new_mode)
    }

    #[access_control(ctx.accounts.validate(start_timestamp, end_timestamp))]
    pub fn init_vault(
        ctx: Context<InitVault>,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp,
        adapters: Vec<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp, adapters)
    }

    pub fn edit_vault(
        ctx: Context<EditVault>,
        vault_index: u8,
        new_start_timestamp: Option<UnixTimestamp>,
        new_end_timestamp: Option<UnixTimestamp>,
    ) -> Result<()> {
        ctx.accounts.handle_and_validate(vault_index, new_start_timestamp, new_end_timestamp)
    }

    #[access_control(ctx.accounts.validate(ctx.remaining_accounts))]
    pub fn deposit(ctx: Context<Deposit>, adapter_accounts: Vec<u8>) -> Result<()> {
        ctx.accounts.handle(ctx.remaining_accounts, adapter_accounts)
    }

    #[access_control(ctx.accounts.validate(ctx.remaining_accounts))]
    pub fn withdraw(ctx: Context<Withdraw>, adapter_accounts: Vec<u8>) -> Result<()> {
        ctx.accounts.handle(ctx.remaining_accounts, adapter_accounts)
    }
}
