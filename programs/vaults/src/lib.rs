mod constants;
mod cpis;
mod instructions;
mod state;
mod math;
mod error;

use crate::state::AdapterEntry;
use anchor_lang::prelude::*;
use instructions::*;

declare_id!("GFBxbpxbQgnEst4ABx35rV4uW5oTbp85wpPagz39cUgd");

#[program]
pub mod vaults {
    use super::*;

    #[allow(unused_variables)]
    #[access_control(ctx.accounts.validate())]
    pub fn init_group(ctx: Context<InitGroup>, decimals: u8) -> Result<()> {
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
        start_timestamp: i64,
        end_timestamp: i64,
        fp32_fee_rate: u64
    ) -> Result<()> {
        ctx.accounts.handle(start_timestamp, end_timestamp, fp32_fee_rate)
    }

    pub fn edit_vault<'info>(
        ctx: Context<'_, '_, '_, 'info, EditVault<'info>>,
        vault_index: u8,
        new_start_timestamp: Option<i64>,
        new_end_timestamp: Option<i64>
    ) -> Result<()> {
        ctx.accounts.handle_and_validate(
            vault_index,
            new_start_timestamp,
            new_end_timestamp,
            ctx.remaining_accounts
        )
    }

    #[access_control(ctx.accounts.validate(vault_index, amount))]
    pub fn deposit<'info>(
        ctx: Context<'_, '_, '_, 'info, Deposit<'info>>,
        vault_index: u8,
        amount: u64,
        adapter_accounts: Vec<Vec<u8>>
    ) -> Result<()> {
        ctx.accounts.handle(vault_index, amount, adapter_accounts, ctx.remaining_accounts)
    }

    #[access_control(ctx.accounts.validate(vault_index, amount_i, amount_j))]
    pub fn redeem<'info>(
        ctx: Context<'_, '_, '_, 'info, Redeem<'info>>,
        vault_index: u8,
        amount_i: u64,
        amount_j: u64,
        crank_adapter_accounts: Vec<Vec<u8>>,
        redeem_adapter_accounts: Vec<Vec<u8>>
    ) -> Result<()> {
        ctx.accounts.handle(vault_index, amount_i, amount_j, crank_adapter_accounts, redeem_adapter_accounts, ctx.remaining_accounts)
    }

    pub fn crank<'info>(
        ctx: Context<'_, '_, '_, 'info, Crank<'info>>,
        vault_index: u8,
        edit_phase_adapter_accounts: Vec<Vec<u8>>,
        crank_adapter_accounts: Vec<Vec<u8>>
    ) -> Result<()> {
        ctx.accounts.handle(vault_index, edit_phase_adapter_accounts, crank_adapter_accounts, ctx.remaining_accounts)
    }
}
