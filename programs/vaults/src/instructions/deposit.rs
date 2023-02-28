use anchor_lang::{Accounts};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::adapter;
use crate::math::FP32;
use crate::state::{Group, ToAccountInfos};
use crate::state::VaultPhase::Active;

#[derive(Accounts)]
pub struct Deposit<'info> {
    deposit: IDeposit<'info>,

    group: Box<Account<'info, Group>>,

    #[account(
        mut,
        address = group.j_mint
    )]
    j_mint: Box<Account<'info, Mint>>, // Verifying it is the same mint inside of the group ensures everything else.

    #[account(
        init_if_needed,
        payer = deposit.authority,
        token::mint = j_mint,
        token::authority = deposit.authority
    )]
    j_account: Account<'info, TokenAccount>,

    #[account(mut)]
    i_mint: Box<Account<'info, Mint>>, // Verified below

    #[account(
        init_if_needed,
        payer = deposit.authority,
        token::mint = i_mint,
        token::authority = deposit.authority
    )]
    i_account: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
    system_program: Program<'info, System>
}

impl<'info> Deposit<'info> {
    pub fn validate(&self, vault: u8, amount: u64, accounts: &[AccountInfo]) -> Result<()> {
        assert_ne!(amount, 0, "Deposit amount cannot be 0");

        let vault = self.group.vaults.get(vault as usize).unwrap();
        assert!(!vault.deactivated, "Vault is deactivated.");
        assert!(!vault.adapters_verified, "Vault has unverified adapters!");
        assert_eq!(vault.phase, Active, "Vault can only be deposited into while in active mode!");

        // I mint verification, the init_vault instruction verifies everything else about the mint.
        assert_eq!(self.i_mint.key(), vault.i_mint.key(), "Invalid i_mint supplied in context!");

        Ok(())
    }

    pub fn handle(&mut self, vault_index: u8, amount: u64, adapter_accounts: Vec<Vec<u8>>, accounts: &[AccountInfo<'info>]) -> Result<()> {
        let vault = self.group.vaults.get(vault_index as usize).unwrap();
        let mut total_return_amount: u64 = 0;
        // Execute deposit instruction on all providers ensuring all succeed, summing the returned ij mint amounts.

        let adapter_count = self.group.adapter_infos.len();
        for (index, adapter_entry) in self.group.adapter_infos.iter().enumerate() {
            // Calculate the actual amount passed into adapter program based on the ratio
            let adapter_amount = amount.fp32_mul_floor(adapter_entry.ratio_fp32).unwrap();

            // Ensure we call the actual account, failsafe for bad client side code
            let adapter_program = accounts.get(index).unwrap();
            assert_eq!(adapter_program.key(), adapter_entry.adapter, "Adapter program id mismatch");

            let accounts = adapter_accounts
                .try_indexes_to_data(accounts, index, Option::from(adapter_count))
                .iter().map(|info| info.to_account_info())
                .collect::<Vec<_>>();

            adapter::deposit(
                adapter_program.to_account_info(),
                self.deposit.clone(),
                adapter_amount,
                Option::from(accounts),
                None
            )?;
        }

        // Mint the i and j tokens to the user.

        Ok(())
    }
}








