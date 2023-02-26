use anchor_lang::prelude::*;

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct IDeposit<'info> {
    signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct IWithdraw<'info> {
    signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct ICrank<'info> {
    signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct IAdminWithdraw<'info> {
    signer: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct IAdminDeposit<'info> {
    signer: Signer<'info>,
}