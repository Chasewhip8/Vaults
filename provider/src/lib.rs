use anchor_lang::prelude::*;

mod instructions;

#[derive(PartialEq, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum VaultPhase {
    PendingActive,
    Active,
    PendingExpired,
    Expired
}