use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::UnixTimestamp;
use crate::VaultPhase::{Active, Expired};

mod instructions;

pub use instructions::*;

#[derive(PartialEq, Debug, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum VaultPhase {
    PendingActive,
    Active,
    PendingExpired,
    Expired,
    Deactivated // Entered manually by the controller disabling a adapter. (condition: ratio == 0)
}

impl VaultPhase {
    pub fn from_time(
        current_time: UnixTimestamp,
        vault_start_time: UnixTimestamp,
        vault_end_time: UnixTimestamp
    ) -> VaultPhase {
        if current_time >= vault_end_time || current_time < vault_start_time {
            return Expired;
        }
        Active
    }
}