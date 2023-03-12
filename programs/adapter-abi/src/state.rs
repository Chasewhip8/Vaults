use anchor_lang::prelude::*;
use solana_program::clock::UnixTimestamp;

#[derive(PartialEq, Debug, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum Phase {
    PendingActive,
    Active,
    PendingExpired,
    Expired
}

impl Phase {
    pub fn from_time(
        current_time: UnixTimestamp,
        vault_start_time: UnixTimestamp,
        vault_end_time: UnixTimestamp,
    ) -> Phase {
        if current_time >= vault_end_time || current_time < vault_start_time {
            return Phase::Expired;
        }
        Phase::Active
    }
}