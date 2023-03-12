use std::cmp::min;
use anchor_lang::Accounts;
use anchor_lang::prelude::*;
use anchor_lang::prelude::Signer;
use anchor_spl::token::{burn, Burn, Mint, Token, TokenAccount};
use adapter_abi::Phase::Expired;
use crate::cpis::{adapter_crank, adapter_redeem, execute_adapter_cpi_multiple};
use crate::math::{calc_redeem_return, FP32};
use crate::state::{Group};

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
    pub fn validate(&self, vault_index: u8, amount_i: u64, amount_j: u64) -> Result<()> {
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
        let vault = self.group.vaults.get(vault_index as usize).unwrap();

        // Burn their tokens if they dont have enough this will fail!
        self.burn_token(&self.i_mint, &self.i_account, amount_i)?;
        self.burn_token(&self.j_mint, &self.j_account, amount_j)?;

        // For each adapter, crank it to determine its reserves, then calculate the
        execute_adapter_cpi_multiple(
            &self.group.adapter_infos,
            &[crank_adapter_accounts, redeem_adapter_accounts],
            accounts,
            |adapter_entry, adapter_program, adapter_accounts_list| {
                let mut adapter_accounts_iter = adapter_accounts_list.into_iter();

                let crank_accounts = adapter_accounts_iter.next().unwrap();
                let provider_balance = adapter_crank(&self.authority, adapter_program, crank_accounts)
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
                let provider_request_amount = amount_j.fp32_div(adapter_entry.ratio_fp32).unwrap() + i_returns.net;

                let redeem_accounts = adapter_accounts_iter.next().unwrap();
                adapter_redeem(&self.group, adapter_program, redeem_accounts, provider_request_amount)
                    .expect("Redeem adapter CPI instruction failed!");
            }
        );

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
