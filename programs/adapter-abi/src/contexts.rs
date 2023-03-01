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

}

#[derive(Accounts)]
pub struct Execute<'info> {
    #[account(
        owner = VAULTS_PROGRAM.key()
    )]
    pub _ensure_vaults_signed: Signer<'info>,
}