mod constants;
mod cpis;
mod instructions;
mod state;
mod math;

use crate::state::AdapterEntry;
use anchor_lang::prelude::*;
use instructions::*;
use solana_program::clock::UnixTimestamp;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod vaults {
    use super::*;

    #[access_control(ctx.accounts.validate())]
    pub fn init_group(ctx: Context<InitGroup>) -> Result<()> {
        ctx.accounts.handle(*ctx.bumps.get("group").unwrap())
    }

    #[access_control(ctx.accounts.validate(&maybe_new_entries))]
    pub fn edit_group(
        ctx: Context<EditGroup>,
        maybe_new_entries: Option<Vec<AdapterEntry>>
    ) -> Result<()> {
        ctx.accounts.handle(maybe_new_entries)
    }

    #[access_control(ctx.accounts.validate(start_timestamp, end_timestamp))]
    pub fn init_vault(
        ctx: Context<InitVault>,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp)
    }

    pub fn edit_vault(
        ctx: Context<EditVault>,
        vault_index: u8,
        new_start_timestamp: Option<UnixTimestamp>,
        new_end_timestamp: Option<UnixTimestamp>,
        maybe_deactivated: Option<bool>
    ) -> Result<()> {
        ctx.accounts.handle_and_validate(
            vault_index,
            new_start_timestamp,
            new_end_timestamp,
            maybe_deactivated
        )
    }
    
    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
        vault: u8,
        amount: u64,
        adapter_accounts: Vec<Vec<u8>>
    ) -> Result<()> {
        ctx.accounts.validate(vault, amount, ctx.remaining_accounts)?;
        ctx.accounts.handle(vault, amount, adapter_accounts, ctx.remaining_accounts)
    }

    #[access_control(ctx.accounts.validate(amount, ctx.remaining_accounts))]
    pub fn withdraw(
        ctx: Context<Withdraw>,
        amount: u64,
        adapter_accounts: Vec<u8>
    ) -> Result<()> {
        ctx.accounts.handle(amount, ctx.remaining_accounts, adapter_accounts)
    }
}
