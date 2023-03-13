use anchor_lang::prelude::*;
use anchor_spl::token::spl_token::instruction::AuthorityType;
use anchor_spl::token::{Mint, SetAuthority, Token};
use adapter_abi::Phase;
use crate::gen_group_signer_seeds;
use crate::state::{AdapterEntry, Group, VaultPhase, ToAccountInfos};

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

pub fn execute_adapter_cpi<'info>(
    adapter_infos: &Vec<AdapterEntry>,
    account_offsets: &Vec<u8>,
    accounts: &[AccountInfo<'info>],
    context_accounts_len: usize,
    mut make_cpi: impl FnMut(&AdapterEntry, &AccountInfo<'info>, Vec<AccountInfo<'info>>)
) {
    let adapter_count = adapter_infos.len();
    for (index, adapter_entry) in adapter_infos.iter().enumerate() {
        // Ensure we call the actual account, failsafe for bad client side code
        let adapter_program = accounts.get(index).unwrap();
        assert_eq!(adapter_program.key(), adapter_entry.adapter, "Adapter program id mismatch");

        let crank_accounts = account_offsets
            .try_indexes_to_data(accounts, adapter_count, index,context_accounts_len)
            .iter().map(|info| info.to_account_info())
            .collect::<Vec<_>>();

        make_cpi(adapter_entry, adapter_program, crank_accounts);
    }
}

pub fn execute_adapter_cpi_multiple<'info>(
    adapter_infos: &Vec<AdapterEntry>,
    account_offsets_list: &[Vec<u8>],
    accounts: &[AccountInfo<'info>],
    context_accounts_len: usize,
    mut make_cpi: impl FnMut(&AdapterEntry, &AccountInfo<'info>, Vec<Vec<AccountInfo<'info>>>)
) {
    let adapter_count = adapter_infos.len();
    for (index, adapter_entry) in adapter_infos.iter().enumerate() {
        // Ensure we call the actual account, failsafe for bad client side code
        let adapter_program = accounts.get(index).unwrap();
        assert_eq!(adapter_program.key(), adapter_entry.adapter, "Adapter program id mismatch");

        let accounts_vec = account_offsets_list.iter().map(|account_offsets| {
            account_offsets
                .try_indexes_to_data(accounts, adapter_count, index, context_accounts_len)
                .iter().map(|info| info.to_account_info())
                .collect::<Vec<_>>()
        }).collect();

        make_cpi(adapter_entry, adapter_program, accounts_vec);
    }
}

pub fn adapter_deposit<'info>(
    group: &Account<'info, Group>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>,
    adapter_amount: u64
) -> Result<adapter_abi::cpi::Return<u64>> {
    adapter_abi::cpi::deposit(
        CpiContext::new_with_signer(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::Restricted {
                _ensure_vaults_signed: group.to_account_info()
            },
            &[&gen_group_signer_seeds!(group)[..]]
        ).with_remaining_accounts(accounts),
        // Adapter Deposit Parameters
        adapter_amount
    )
}

pub fn adapter_redeem<'info>(
    group: &Account<'info, Group>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>,
    adapter_amount: u64
) -> Result<()> {
    adapter_abi::cpi::redeem(
        CpiContext::new_with_signer(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::Restricted {
                _ensure_vaults_signed: group.to_account_info()
            },
            &[&gen_group_signer_seeds!(group)[..]]
        ).with_remaining_accounts(accounts),
        // Adapter Deposit Parameters
        adapter_amount
    )
}

pub fn adapter_crank<'info>(
    payer: &Signer<'info>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>
) -> Result<adapter_abi::cpi::Return<u64>> {
    adapter_abi::cpi::crank(
        CpiContext::new(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::ICrank {
                payer: payer.to_account_info(),
            }
        ).with_remaining_accounts(accounts)
    )
}

pub fn adapter_edit_phase<'info>(
    group: &Account<'info, Group>,
    adapter_program: &AccountInfo<'info>,
    accounts: Vec<AccountInfo<'info>>,
    new_phase: VaultPhase
) -> Result<adapter_abi::cpi::Return<Phase>> {
    adapter_abi::cpi::edit_phase(
        CpiContext::new_with_signer(
            adapter_program.to_account_info(),
            adapter_abi::cpi::accounts::Restricted {
                _ensure_vaults_signed: group.to_account_info()
            },
            &[&gen_group_signer_seeds!(group)[..]]
        ).with_remaining_accounts(accounts),
        // Adapter Deposit Parameters
        new_phase.to_adapter()
    )
}