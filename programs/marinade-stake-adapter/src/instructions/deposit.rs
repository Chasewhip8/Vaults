use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub deposit: IDeposit<'info>, // From symlink of lib-adapter
}
