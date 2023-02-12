use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use crate::constants::VAULT_AUTHORITY;
use crate::state::Group;

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct InitGroup<'info> {
    #[account(
        mut,
        address = VAULT_AUTHORITY.key()
    )]
    payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = Group::LEN + 8,
        seeds = [
            b"Group".as_ref(),
            j_mint.key().as_ref()
        ],
        bump
    )]
    group: Box<Account<'info, Group>>,

    #[account(
        init_if_needed,
        payer = payer,
        mint::authority = group,
        mint::freeze_authority = group,
        mint::decimals = decimals
    )]
    j_mint: Box<Account<'info, Mint>>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>
}

impl<'info> InitGroup<'info> {
    pub fn handle(&mut self) -> Result<()> {
        let group = &mut self.group;
        group.j_mint = self.j_mint.key();
        group.vaults = Vec::new();
        group.provider_infos = Vec::new();
        Ok(())
    }
}