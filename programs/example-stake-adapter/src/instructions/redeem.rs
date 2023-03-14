use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, transfer, Transfer};
use crate::contexts::*;
use crate::gen_adapter_signer_seeds;
use crate::state::Adapter;

#[derive(Accounts)]
pub struct Redeem<'info> {
    restricted: Restricted<'info>,

    #[account(
        mut,
        token::mint = adapter.base_mint
    )]
    stake_account: Box<Account<'info, TokenAccount>>,

    #[account(
        mut,
        token::mint = adapter.base_mint
    )]
    user_account: Box<Account<'info, TokenAccount>>,

    token_program: Program<'info, Token>,
    adapter: Account<'info, Adapter>,
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