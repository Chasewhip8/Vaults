use anchor_lang::prelude::*;

use std::mem;
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use lib_adapter::VaultPhase;
use crate::constants::{MAX_ADAPTERS, MAX_VAULTS};
use crate::state::Mode::Active;

#[account]
#[derive(Default)]
pub struct Group {
    pub state: Mode,
    pub j_mint: Pubkey,
    pub adapter_infos: Vec<VaultEntry>,
    pub vaults: Vec<Vault>
}

impl Group {
    pub const LEN: usize = 32 +
        VaultEntry::LEN * MAX_ADAPTERS +
        Vault::LEN * MAX_VAULTS
    ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Vault {
    pub group: Pubkey,
    pub i_mint: Pubkey,
    pub adapters: Vec<Pubkey>,
    pub phase: VaultPhase,
    pub start_timestamp: UnixTimestamp,
    pub end_timestamp: UnixTimestamp,
}

impl Vault {
    pub const LEN: usize = 32 +
        32 +
        32 * MAX_ADAPTERS +
        1 +
        8 +
        8
    ;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultEntry {
    pub adapter: Pubkey,
    pub ratio: f32
}

impl VaultEntry {
    pub const LEN: usize = 36;
    const _LEN_CHECK: [u8; VaultEntry::LEN] = [0; mem::size_of::<Self>()];
}

impl PartialEq for VaultEntry {
    fn eq(&self, other: &Self) -> bool {
        self.adapter.key().eq(&other.adapter.key())
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

type AccountOffsets = Vec<u8>;

trait ToAccountInfos {
    fn try_to_accounts(&self, accounts: &[AccountInfo], index: usize) -> &[AccountInfo];
}

impl ToAccountInfos for AccountOffsets {
    fn try_to_accounts(&self, accounts: &[AccountInfo], index: usize) -> &[AccountInfo] {
        let mut total_offset: u8 = 0;
        for offset in &self[0..index] {
            total_offset += offset;
        }
        &accounts[(total_offset as usize)..(self[total_offset as usize] as usize)]
    }
}