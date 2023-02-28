use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(j_mint: Pubkey, bump: u8)]
pub struct IDeposit<'info> {
    #[account(
        seeds = [
            b"Group".as_ref(),
            j_mint.as_ref()
        ],
        bump = bump,
        seeds::program = other_program.key()
    )]
    pub _ensure_signed: Signer<'info>,
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