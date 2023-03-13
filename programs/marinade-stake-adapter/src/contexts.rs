use anchor_lang::prelude::*;
use adapter_abi::constants::VAULTS_PROGRAM;

#[derive(Accounts)]
pub struct Restricted<'info> {
    #[account(
        owner = VAULTS_PROGRAM.key()
    )]
    pub _ensure_vaults_signed: Signer<'info>
}