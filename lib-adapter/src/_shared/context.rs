use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct IDeposit<'info> {
    signer: Signer<'info>,
}
