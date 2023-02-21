use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    signer: Signer<'info>,
}