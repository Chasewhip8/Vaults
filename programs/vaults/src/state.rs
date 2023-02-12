use anchor_lang::prelude::*;

use std::mem;
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use adapter::VaultPhase;
use crate::constants::{MAX_PROVIDERS, MAX_VAULTS};
use crate::state::Mode::Active;

#[account]
#[derive(Default)]
pub struct Group {
    pub state: Mode,
    pub j_mint: Pubkey,
    pub provider_infos: Vec<VaultEntry>,
    pub vaults: Vec<Vault>
}

impl Group {
    pub const LEN: usize = 32 +
        VaultEntry::LEN * MAX_PROVIDERS +
        Vault::LEN * MAX_VAULTS
    ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Vault {
    pub group: Pubkey,
    pub i_mint: Pubkey,
    pub providers: Vec<Pubkey>,
    pub phase: VaultPhase,
    pub start_timestamp: UnixTimestamp,
    pub end_timestamp: UnixTimestamp,
}

impl Vault {
    pub const LEN: usize = 32 +
        32 +
        32 * MAX_PROVIDERS +
        1 +
        8 +
        8
    ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultEntry {
    pub provider: Pubkey,
    pub ratio: f32
}

impl VaultEntry {
    pub const LEN: usize = 36;
    const _LEN_CHECK: [u8; VaultEntry::LEN] = [0; mem::size_of::<Self>()];
}

impl PartialEq for VaultEntry {
    fn eq(&self, other: &Self) -> bool {
        self.provider.key().eq(&other.provider.key())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum Mode {
    Active,
    Halted
}

impl Default for Mode {
    fn default() -> Self {
        Active
    }
}