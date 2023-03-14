use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, transfer, Transfer};
use crate::contexts::*;
use crate::state::Adapter;

#[derive(Accounts)]
pub struct Deposit<'info> {
    restricted: Restricted<'info>,
    user: Signer<'info>,

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

impl<'info> Deposit<'info> {
    pub fn validate(&self, amount: u64) -> Result<()> {
        assert_ne!(amount, 0, "Cannot redeem 0!");
        Ok(())
    }

    pub fn handle(&mut self, amount: u64) -> Result<u64> {
        transfer(
            CpiContext::new(
                self.token_program.to_account_info(),
                Transfer {
                    from: self.user_account.to_account_info(),
                    to: self.stake_account.to_account_info(),
                    authority: self.user.to_account_info()
                }
            ),
            amount
        )?;

        // Get the fresh state!
        self.stake_account.reload()?;

        Ok(self.stake_account.amount)
    }
}