use anchor_lang::prelude::*;
use anchor_spl::token::spl_token::instruction::AuthorityType;
use anchor_spl::token::{Mint, SetAuthority, Token};
use crate::gen_group_signer_seeds;
use crate::state::Group;

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
            }
        ),
        AuthorityType::MintTokens,
        Option::from(group),
    )
    .expect("Authority should have been transferred to group but failed.");
}

pub fn adapter_deposit<'info>(
    group: &Account<'info, Group>,
    authority: &Signer<'info>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>,
    adapter_amount: u64
) -> Result<adapter_abi::cpi::Return<u64>> {
    adapter_abi::cpi::deposit(
        CpiContext::new_with_signer(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::IDeposit {
                _ensure_vaults_signed: group.to_account_info(),
                authority: authority.to_account_info()
            },
            &[&gen_group_signer_seeds!(group)[..]]
        ).with_remaining_accounts(accounts),
        // Adapter Deposit Parameters
        adapter_amount
    )
}

pub fn adapter_redeem<'info>(
    group: &Account<'info, Group>,
    authority: &Signer<'info>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>,
    adapter_amount: u64
) -> Result<()> {
    adapter_abi::cpi::redeem(
        CpiContext::new_with_signer(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::IDeposit {
                _ensure_vaults_signed: group.to_account_info(),
                authority: authority.to_account_info()
            },
            &[&gen_group_signer_seeds!(group)[..]]
        ).with_remaining_accounts(accounts),
        // Adapter Deposit Parameters
        adapter_amount
    )
}

pub fn adapter_crank<'info>(
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>
) -> Result<adapter_abi::cpi::Return<u64>> {
    adapter_abi::cpi::crank(
        CpiContext::new(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::ICrank {}
        ).with_remaining_accounts(accounts)
    )
}