use crate::*;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Deposit<'info> {
    signer: Signer<'info>,
}

//
// #[macro_export]
// macro_rules! deposit_ix {
//     () => {
//         #[access_control(ctx.accounts.validate())]
//         pub fn deposit(
//             ctx: Context<Deposit>,
//         ) -> Result<()> {
//             ctx.accounts.handle()
//         }
//     }
// }
//
// pub trait IDeposit {
//     fn validate(&self) -> Result<()>;
//     fn handle(&mut self) -> Result<()>;
// }