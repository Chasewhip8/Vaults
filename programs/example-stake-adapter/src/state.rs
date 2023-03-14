use std::mem;
use anchor_lang::prelude::*;

#[account]
pub struct Adapter {
    pub stake_account: Pubkey,
    pub internal_phase: Phase, // Not needed but for example!
    pub base_mint: Pubkey,
    pub i_mint: Pubkey,
    pub bump: u8
}

impl Adapter {
    pub const LEN: usize = 104;
    const _LEN_CHECK: [u8; Self::LEN] = [0; mem::size_of::<Self>()];
}

#[macro_export]
macro_rules! gen_adapter_signer_seeds {
    ($group:expr) => {
        &[
             b"Adapter".as_ref(),
             $group.i_mint.key().as_ref(),
             &[$group.bump],
        ]
    };
}

#[derive(PartialEq, Debug, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum Phase {
    PendingActive,
    Active,
    PendingExpired,
    Expired
}