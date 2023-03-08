use anchor_spl::token::Mint;
use crate::*;

#[derive(Accounts)]
pub struct IDeposit<'info> {
    #[account(
        owner = VAULTS_PROGRAM.key()
    )]
    pub _ensure_vaults_signed: Signer<'info>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct IRedeem<'info> {
    #[account(
        owner = VAULTS_PROGRAM.key()
    )]
    pub _ensure_vaults_signed: Signer<'info>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ICrank<'info> {
    authority: Signer<'info>
}

#[derive(Accounts)]
pub struct IInitialize<'info> {
    payer: Signer<'info>,
    i_mint: Box<Account<'info, Mint>>
}