use anchor_lang::prelude::*;
use crate::shared::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub deposit: IDeposit<'info>, // From symlink of lib-adapter
}