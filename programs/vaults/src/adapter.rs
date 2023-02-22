use anchor_lang::prelude::*;
use cpi_interface::global_interface;
use crate::_shared::IDeposit;

#[global_interface]
pub trait AdapterInterface<'info, T: Accounts<'info>> {
    fn deposit(ctx: Context<T>) -> Result<()>;
}

pub fn deposit<'info>(
    adapter_program: AccountInfo<'info>,
    cpi_accounts: IDeposit<'info>,
    remaining_accounts: Option<Vec<AccountInfo<'info>>>,
    signer_seeds: Option<&[&[&[u8]]]>,
) -> Result<()> {
    let mut cpi_ctx = CpiContext::new(adapter_program, cpi_accounts);
    if let Some(seeds) = signer_seeds {
        cpi_ctx = cpi_ctx.with_signer(seeds);
    }
    if let Some(remaining_accounts) = remaining_accounts {
        cpi_ctx = cpi_ctx.with_remaining_accounts(remaining_accounts);
    }
    adapter_interface::deposit(cpi_ctx)
}