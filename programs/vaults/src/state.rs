use anchor_lang::prelude::*;

use crate::_shared::VaultPhase;
use crate::constants::{MAX_ADAPTERS, MAX_VAULTS};
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use std::mem;

#[account]
#[derive(Default)]
pub struct Group {
    pub j_mint: Pubkey,
    pub adapter_infos: Vec<VaultEntry>,
    pub vaults: Vec<Vault>,
}

impl Group {
    pub const LEN: usize = 32 + VaultEntry::LEN * MAX_ADAPTERS + Vault::LEN * MAX_VAULTS;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Vault {
    pub group: Pubkey,
    pub i_mint: Pubkey,
    pub phase: VaultPhase,
    pub start_timestamp: UnixTimestamp,
    pub end_timestamp: UnixTimestamp,
    pub adapters_verified: bool,
    pub deactivated: bool
}

impl Vault {
    pub const LEN: usize = 32 + 32 + 32 * MAX_ADAPTERS + 1 + 8 + 8;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultEntry {
    pub adapter: Pubkey,
    pub ratio: f32,
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

pub trait ToAccountInfos {
    fn try_to_accounts<'a>(
        &'a self,
        accounts: &'a [AccountInfo<'a>],
        index: usize,
    ) -> &'a [AccountInfo];
}

impl ToAccountInfos for Vec<u8> {
    fn try_to_accounts<'a>(
        &'a self,
        accounts: &'a [AccountInfo<'a>],
        index: usize,
    ) -> &'a [AccountInfo] {
        let mut total_offset: u8 = 0;
        for offset in &self[0..index] {
            total_offset += offset;
        }
        let size = total_offset as usize;
        &accounts[(size)..(self[size] as usize)]
    }
}
