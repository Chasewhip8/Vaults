use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use solana_program::clock::UnixTimestamp;
use solana_program::program_option::COption;

use crate::cpis::cpi_transfer_mint_authority_to_group;
use crate::state::{Group, Vault};
use crate::state::VaultPhase::Expired;

#[derive(Accounts)]
pub struct InitVault<'info> {
    #[account(mut)]
    vault_authority: Signer<'info>,

    #[account(
        mut,
        has_one = j_mint
    )]
    group: Box<Account<'info, Group>>,

    #[account(
        init_if_needed,
        payer = vault_authority,
        mint::authority = vault_authority,
        mint::decimals = j_mint.decimals
    )]
    i_mint: Box<Account<'info, Mint>>,
    j_mint: Box<Account<'info, Mint>>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
}

impl<'info> InitVault<'info> {
    pub fn validate(
        &self,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp,
    ) -> Result<()> {
        assert_eq!(self.i_mint.supply, 0);
        assert_eq!(self.i_mint.freeze_authority, COption::None);

        assert!(
            start_timestamp < end_timestamp,
            "Start timestamp after end timestamp!"
        );

        Ok(())
    }

    pub fn handle(
        &mut self,
        start_timestamp: UnixTimestamp,
        end_timestamp: UnixTimestamp
    ) -> Result<()> {
        let group = &mut self.group;

        let vault = Vault {
            i_mint: self.i_mint.key(),
            phase: Expired, // Force into expired to go through the crank to active logic!
            start_timestamp,
            end_timestamp,
            adapters_verified: false,
            deactivated: false // Do not start deactivated, adapters_verified takes care of it.
        };

        // Specifically push here, we do not want to shift the index of other vaults, ever!
        group.vaults.push(vault);

        // Set the authority of the mint to the group!
        cpi_transfer_mint_authority_to_group(
            &self.token_program,
            self.group.key(),
            &self.vault_authority,
            &self.i_mint,
        );

        Ok(())
    }
}
