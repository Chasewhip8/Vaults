use anchor_lang::prelude::*;

use std::mem;
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use provider::VaultPhase;

#[account]
#[derive(Default)]
pub struct Group {
    pub j_mint: Pubkey,
    pub provider_infos: Vec<VaultEntry>,
    pub vaults: Vec<Vault>
}

impl Group {
    pub const LEN: usize = 80;
    const _LEN_CHECK: [u8; Group::LEN] = [0; mem::size_of::<Group>()];
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct VaultEntry {
    pub provider: Pubkey,
    pub ratio: f32
}