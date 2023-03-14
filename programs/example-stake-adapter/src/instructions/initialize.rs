use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::Adapter;
use crate::state::Phase::{Expired};

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    i_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        payer = payer,
        token::mint = base_mint,
        token::authority = adapter,
    )]
    stake_account: Box<Account<'info, TokenAccount>>,
    base_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        space = Adapter::LEN + 8,
        payer = payer,
        seeds = [
            b"Adapter",
            i_mint.key().as_ref()
        ],
        bump
    )]
    adapter: Account<'info, Adapter>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

impl<'info> Initialize<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, bump: u8) -> Result<()> {
        let adapter = &mut self.adapter;
        
        adapter.internal_phase = Expired;
        adapter.stake_account = self.stake_account.key();
        adapter.i_mint = self.i_mint.key();
        adapter.bump = bump;
        adapter.base_mint = self.base_mint.key();
        
        Ok(())
    }
}