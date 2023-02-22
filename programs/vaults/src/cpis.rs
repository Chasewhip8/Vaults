use anchor_lang::prelude::*;
use anchor_spl::token::spl_token::instruction::AuthorityType;
use anchor_spl::token::{Mint, SetAuthority, Token};

pub fn cpi_transfer_mint_authority_to_group<'info>(
    token_program: &Program<'info, Token>,
    group: Pubkey,
    vault_authority: &Signer<'info>,
    mint: &Account<'info, Mint>,
) {
    anchor_spl::token::set_authority(
        CpiContext::new(
            token_program.to_account_info(),
            SetAuthority {
                current_authority: vault_authority.to_account_info(),
                account_or_mint: mint.to_account_info(),
            },
        ),
        AuthorityType::MintTokens,
        Option::from(group),
    )
    .expect("Authority should have been transferred to group but failed.");
}
