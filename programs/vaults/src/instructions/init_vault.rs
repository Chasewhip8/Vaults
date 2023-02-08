use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use solana_program::clock::UnixTimestamp;
use adapter::VaultPhase::Expired;
use crate::state::{Group, Vault};

#[derive(Accounts)]
pub struct InitVault<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    #[account(
        mut,
        has_one = j_mint
    )]
    group: Box<Account<'info, Group>>,

    #[account(
        init_if_needed,
        payer = authority,
        mint::authority = group,
        mint::freeze_authority = group,
        mint::decimals = j_mint.decimals
    )]
    i_mint: Box<Account<'info, Mint>>,
    j_mint: Box<Account<'info, Mint>>,

    system_program: Program<'info, System>,
    token_program: Program<'info, Token>
}

impl<'info> InitVault<'info> {
    pub fn validate(self, start_timestamp: UnixTimestamp, end_timestamp: UnixTimestamp) -> Result<()> {
        assert!(start_timestamp < end_timestamp, "Start timestamp after end timestamp!");

        Ok(())
    }

    pub fn handle(&mut self, start_timestamp: UnixTimestamp, end_timestamp: UnixTimestamp, providers: &[AccountInfo]) -> Result<()> {
        let group = &mut self.group;

        let providers = providers.iter().map(|x| { *x.key }).collect::<Vec<_>>();

        let vault = Vault {
            group: group.key(),
            i_mint: self.i_mint.key(),
            providers,
            phase: Expired, // Force into expired to go through the crank to active logic!
            start_timestamp,
            end_timestamp
        };

        group.vaults.push(vault);

        Ok(())
    }
}