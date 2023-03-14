use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Mint, Token, TokenAccount, transfer, Transfer};
use crate::contexts::*;
use crate::gen_adapter_signer_seeds;
use crate::state::Adapter;

#[derive(Accounts)]
pub struct Redeem<'info> {
    restricted: Restricted<'info>,

    #[account(mut)]
    user: Signer<'info>,

    #[account(mut)]
    stake_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = base_mint,
        associated_token::authority = user
    )]
    user_account: Box<Account<'info, TokenAccount>>,
    base_mint: Box<Account<'info, Mint>>,
    
    #[account(
        has_one = stake_account,
        has_one = base_mint
    )]
    adapter: Account<'info, Adapter>,

    token_program: Program<'info, Token>,
    associated_token_program: Program<'info, AssociatedToken>,
    system_program: Program<'info, System>,
}

impl<'info> Redeem<'info> {
    pub fn validate(&self, amount: u64) -> Result<()> {
        assert_ne!(amount, 0, "Cannot redeem 0!");
        Ok(())
    }

    pub fn handle(&mut self, amount: u64) -> Result<()> {
        transfer(
            CpiContext::new_with_signer(
                self.token_program.to_account_info(),
                Transfer {
                    from: self.stake_account.to_account_info(),
                    to: self.user_account.to_account_info(),
                    authority: self.adapter.to_account_info()
                },
                &[gen_adapter_signer_seeds!(self.adapter)]
            ),
            amount
        )
    }
}