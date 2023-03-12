use std::cmp::min;
use anchor_lang::{Accounts};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, mint_to, MintTo, Token, TokenAccount};
use adapter_abi::Phase::Active;
use crate::cpis::adapter_deposit;
use crate::gen_group_signer_seeds;
use crate::math::{calc_deposit_return_adapter, FP32};
use crate::state::{AdapterEntry, Group, ToAccountInfos};

// Note: The Redeem and Deposit contexts are almost identical if not identical.
#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    #[account(
        has_one = j_mint
    )]
    group: Box<Account<'info, Group>>,

    #[account(mut)]
    j_mint: Box<Account<'info, Mint>>, // Verifying it is the same mint inside of the group above ensures everything else.

    #[account(
        init_if_needed,
        payer = authority,
        token::mint = j_mint,
        token::authority = authority
    )]
    j_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    i_mint: Box<Account<'info, Mint>>, // Verified below

    #[account(
        init_if_needed,
        payer = authority,
        token::mint = i_mint,
        token::authority = authority
    )]
    i_account: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,
    system_program: Program<'info, System>
}

impl<'info> Deposit<'info> {
    pub fn validate(&self, vault_index: u8, amount: u64) -> Result<()> {
        assert_ne!(amount, 0, "Deposit amount cannot be 0");

        let vault = self.group.vaults.get(vault_index as usize).unwrap();
        assert!(!vault.adapters_verified, "Vault has unverified adapters!");
        assert_eq!(vault.phase, Active, "Vault can only be deposited into while in active mode!");

        // I mint verification, the init_vault instruction verifies everything else about the mint.
        assert_eq!(self.i_mint.key(), vault.i_mint.key(), "Invalid i_mint supplied in context!");

        Ok(())
    }

    pub fn handle(&mut self, vault_index: u8, amount: u64, deposit_adapter_accounts: Vec<Vec<u8>>, accounts: &[AccountInfo<'info>]) -> Result<()> {
        let mut total_return_amount: u64 = 0;

        msg!("Depositing {} to adapters.", amount);

        // Execute deposit instruction on all providers ensuring all succeed, summing the returned ij mint amounts.
        self.group.execute_adapter_cpi(
            deposit_adapter_accounts, accounts,
            |adapter_entry, adapter_program, adapter_accounts| {
                // Calculate the actual amount passed into adapter program based on the ratio
                let adapter_amount = amount.fp32_mul_floor(adapter_entry.ratio_fp32).unwrap();

                let provider_balance = adapter_deposit(&self.group, &self.authority, adapter_program, adapter_accounts, adapter_amount)
                    .expect("Deposit adapter CPI instruction failed!")
                    .get();

                let return_amount = calc_deposit_return_adapter(
                    adapter_amount,
                    self.i_mint.supply,
                    provider_balance // TODO determine if provider_balance should be before or after deposit
                );

                assert!(return_amount > 0, "Invalid return amount from adapter deposit of 0");

                total_return_amount += return_amount;
            }
        );

        // Prevent minting more than 1:1 for a deposit, this is due to excess i_supply when multiple cycles occur.
        total_return_amount = min(total_return_amount, amount);

        msg!("Minting {} I and J tokens to user.", total_return_amount);

        // Mint the i and j tokens to the user.
        self.mint_to_user(&self.j_mint, &self.j_account, total_return_amount)?;
        self.mint_to_user(&self.i_mint, &self.i_account, total_return_amount)?;

        // Add the additional J tokens we just minted to the outstanding balance of the vault
        let vault = self.group.vaults.get_mut(vault_index as usize).unwrap();
        vault.j_balance += total_return_amount;

        Ok(())
    }

    fn mint_to_user(&self, mint: &Account<'info, Mint>, destination_account: &Account<'info, TokenAccount>, amount: u64) -> Result<()> {
        mint_to(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                MintTo {
                    mint: mint.to_account_info(),
                    to: destination_account.to_account_info(),
                    authority: self.group.to_account_info()
                },
                &[&gen_group_signer_seeds!(self.group)[..]]
            ),
            amount
        )
    }
}