use anchor_spl::token::Mint;
use crate::*;

#[derive(Accounts)]
pub struct Restricted<'info> {
    #[account(
        owner = VAULTS_PROGRAM.key()
    )]
    pub _ensure_vaults_signed: Signer<'info>
}

#[derive(Accounts)]
pub struct ICrank<'info> {
    pub payer: Signer<'info>,
}

#[derive(Accounts)]
pub struct IInitialize<'info> {
    payer: Signer<'info>,
    i_mint: Box<Account<'info, Mint>>
}