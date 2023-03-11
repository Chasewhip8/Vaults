use std::cmp::min;
use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::Signer;
use anchor_spl::token::{burn, Burn, Mint, Token, TokenAccount};
use anchor_spl::token::spl_token::instruction::burn_checked;
use crate::cpis::{adapter_crank, adapter_redeem};
use crate::math::{calc_deposit_return_adapter, calc_redeem_return, FP32};
use crate::state::{Group, ToAccountInfos};
use crate::state::VaultPhase::{Active, Expired};

// Note: The Redeem and Deposit contexts are almost identical if not identical.
#[derive(Accounts)]
pub struct Redeem<'info> {
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

impl<'info> Redeem<'info> {
    pub fn validate(&self, vault_index: u8, amount_i: u64, amount_j: u64, accounts: &[AccountInfo]) -> Result<()> {
        assert_ne!(amount_i + amount_j, 0, "Redeem amounts summed to 0.");

        let vault = self.group.vaults.get(vault_index as usize).unwrap();
        assert!(!vault.adapters_verified, "Vault has unverified adapters!");

        // I mint verification, the init_vault instruction verifies everything else about the mint.
        assert_eq!(self.i_mint.key(), vault.i_mint.key(), "Invalid i_mint supplied in context!");

        if vault.phase != Expired {
            let amount_ij = min(amount_i, amount_j);
            let amount_j = amount_j - amount_ij;
            assert_eq!(amount_j, 0, "Cannot redeem excess J tokens while vault is not expired!");
        } else {
            assert!(vault.j_balance >= amount_j, "Vault J balance to low to fulfil redemption.");
        }

        Ok(())
    }

    pub fn handle(
        &mut self,
        vault_index: u8,
        amount_i: u64,
        amount_j: u64,
        crank_adapter_accounts: Vec<Vec<u8>>,
        redeem_adapter_accounts: Vec<Vec<u8>>,
        accounts: &[AccountInfo<'info>]
    ) -> Result<()> {
        let vault = self.group.vaults.get_mut(vault_index as usize).unwrap();

        // Burn their tokens if they dont have enough this will fail!
        self.burn_token(&self.i_mint, &self.i_account, amount_i)?;
        self.burn_token(&self.j_mint, &self.j_account, amount_j)?;

        // For each adapter, crank it to determine its reserves, then calculate the
        let adapter_count = self.group.adapter_infos.len();
        for (index, adapter_entry) in self.group.adapter_infos.iter().enumerate() {
            // Ensure we call the actual account, failsafe for bad client side code
            let adapter_program = accounts.get(index).unwrap();
            assert_eq!(adapter_program.key(), adapter_entry.adapter, "Adapter program id mismatch");

            let crank_accounts = crank_adapter_accounts
                .try_indexes_to_data(accounts, index, Option::from(adapter_count))
                .iter().map(|info| info.to_account_info())
                .collect::<Vec<_>>();

            let provider_balance = adapter_crank(adapter_program, crank_accounts)
                .expect("Crank adapter CPI instruction failed!")
                .get();

            // TODO check this I am so tired
            let i_provider_balance = provider_balance - vault.j_balance;
            let i_returns = calc_redeem_return(
                amount_i,
                self.i_mint.supply,
                vault.fp32_fee_rate,
                adapter_entry.ratio_fp32,
                i_provider_balance
            );
            let provider_request_amount = amount_j.fp32_div(adapter_entry.ratio_fp32).unwrap() + i_returns;

            let redeem_accounts = redeem_adapter_accounts
                .try_indexes_to_data(accounts, index, Option::from(adapter_count))
                .iter().map(|info| info.to_account_info())
                .collect::<Vec<_>>();

            adapter_redeem(&self.group, &self.authority, adapter_program, redeem_accounts, provider_request_amount)
                .expect("Redeem adapter CPI instruction failed!");
        }

        Ok(())
    }

    fn burn_token(&self, mint: &Account<'info, Mint>, from_account: &Account<'info, TokenAccount>, burn_amount: u64) -> Result<()> {
        burn(
            CpiContext::new(
                self.token_program.to_account_info(),
                Burn {
                    mint: mint.to_account_info(),
                    from: from_account.to_account_info(),
                    authority: self.authority.to_account_info()
                }
            ),
            burn_amount
        )
    }
}
