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
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ICrank<'info> {
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct IAdminWithdraw<'info> {
    pub vault_authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct IAdminDeposit<'info> {
    pub vault_authority: Signer<'info>,
}