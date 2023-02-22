use crate::constants::VAULT_AUTHORITY;
use crate::cpis::cpi_transfer_mint_authority_to_group;
use crate::state::Group;
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use solana_program::program_option::COption;

#[derive(Accounts)]
#[instruction(decimals: u8)]
pub struct InitGroup<'info> {
    #[account(
        mut,
        address = VAULT_AUTHORITY.key()
    )]
    vault_authority: Signer<'info>,

    #[account(
        init,
        payer = vault_authority,
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
        payer = vault_authority,
        mint::authority = vault_authority,
        mint::decimals = decimals
    )]
    j_mint: Box<Account<'info, Mint>>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

impl<'info> InitGroup<'info> {
    pub fn validate(&self) -> Result<()> {
        assert_eq!(self.j_mint.supply, 0);
        assert_eq!(self.j_mint.freeze_authority, COption::None);

        Ok(())
    }

    pub fn handle(&mut self) -> Result<()> {
        let group = &mut self.group;

        group.j_mint = self.j_mint.key();
        group.vaults = Vec::new();
        group.adapter_infos = Vec::new();

        // Set the authority of the mint to the group!
        cpi_transfer_mint_authority_to_group(
            &self.token_program,
            self.group.key(),
            &self.vault_authority,
            &self.j_mint,
        );

        Ok(())
    }
}
