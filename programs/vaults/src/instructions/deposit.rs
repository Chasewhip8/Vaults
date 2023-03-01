use anchor_lang::{Accounts};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, mint_to, MintTo, Token, TokenAccount};
use crate::gen_group_signer_seeds;
use crate::math::{calc_deposit_return_adapter, FP32};
use crate::state::{Group, ToAccountInfos};
use crate::state::VaultPhase::Active;

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

    pub fn handle(&mut self, vault_index: u8, amount: u64, adapter_accounts: Vec<Vec<u8>>, accounts: &[AccountInfo<'info>]) -> Result<()> {
        let mut total_return_amount: u64 = 0;

        msg!("Depositing {} to adapters.", amount);

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

            let provider_balance = self.adapter_deposit(adapter_program, accounts, adapter_amount)
                .expect("Deposit adapter CPI instruction failed!")
                .get();

            let return_amount = calc_deposit_return_adapter(
                adapter_amount,
                self.i_mint.supply,
                provider_balance
            );

            assert!(return_amount > 0, "Invalid return amount from adapter deposit of 0");

            total_return_amount += return_amount;
        }

        msg!("Minting {} I and J tokens to user.", total_return_amount);

        // Mint the i and j tokens to the user.
        self.mint_to_user(&self.j_mint, &self.j_account, total_return_amount)?;
        self.mint_to_user(&self.i_mint, &self.i_account, total_return_amount)?;

        // Add the additional J tokens we just minted to the outstanding balance of the vault
        let vault = self.group.vaults.get_mut(vault_index as usize).unwrap();
        vault.j_balance += total_return_amount;

        Ok(())
    }

    fn adapter_deposit(&self, adapter_program: &AccountInfo<'info>, accounts: Vec<AccountInfo<'info>>, adapter_amount: u64) -> Result<adapter_abi::cpi::Return<u64>> {
        adapter_abi::cpi::deposit(
            CpiContext::new_with_signer(
                adapter_program.to_account_info(),
                adapter_abi::cpi::accounts::IDeposit {
                    _ensure_vaults_signed: self.group.to_account_info(),
                    authority: self.authority.to_account_info()
                },
                &[&gen_group_signer_seeds!(self.group)[..]]
            ).with_remaining_accounts(accounts),
            // Adapter Deposit Parameters
            adapter_amount
        )
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