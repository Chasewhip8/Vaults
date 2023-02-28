use anchor_lang::prelude::*;

use crate::constants::{MAX_ADAPTERS, MAX_VAULTS};
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use std::mem;

#[account]
#[derive(Default)]
pub struct Group {
    pub j_mint: Pubkey,
    pub adapter_infos: Vec<AdapterEntry>,
    pub vaults: Vec<Vault>,
}

impl Group {
    pub const LEN: usize = 32 + AdapterEntry::LEN * MAX_ADAPTERS + Vault::LEN * MAX_VAULTS;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Vault {
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
pub struct AdapterEntry {
    pub adapter: Pubkey,
    pub ratio_fp32: u64,
}

impl AdapterEntry {
    pub const LEN: usize = 40;
    const _LEN_CHECK: [u8; AdapterEntry::LEN] = [0; mem::size_of::<Self>()];
}

impl PartialEq for AdapterEntry {
    fn eq(&self, other: &Self) -> bool {
        self.adapter.key().eq(&other.adapter.key())
    }
}

#[derive(PartialEq, Debug, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum VaultPhase {
    PendingActive,
    Active,
    PendingExpired,
    Expired,
    Deactivated, // Entered manually by the controller disabling a adapter. (condition: ratio == 0)
}

impl VaultPhase {
    pub fn from_time(
        current_time: UnixTimestamp,
        vault_start_time: UnixTimestamp,
        vault_end_time: UnixTimestamp,
    ) -> VaultPhase {
        if current_time >= vault_end_time || current_time < vault_start_time {
            return VaultPhase::Expired;
        }
        VaultPhase::Active
    }
}

pub trait ToAccountInfos {
    fn try_indexes_to_data<'a, T: 'a>(
        &self,
        data: &'a [T],
        index: usize,
        offset: Option<usize>
    ) -> Vec<&'a T>;
}

impl ToAccountInfos for Vec<Vec<u8>> {
    fn try_indexes_to_data<'a, T: 'a>(
        &self,
        data: &'a [T],
        index: usize,
        offset: Option<usize>
    ) -> Vec<&'a T> {
        let indexes = self.get(index).unwrap();
        let offset = offset.unwrap_or(0);
        indexes.iter()
            .map(|index| data.get(offset + *index as usize).expect("Value does not exist in data at index!"))
            .collect::<Vec<_>>()
    }
}

#[cfg(test)]
mod tests {
    use crate::state::ToAccountInfos;

    #[test]
    fn try_indexes_to_data_test() {
        let test_data = &[5, 6, 7, 8, 9];
        let test_indexes: Vec<Vec<u8>> = vec!(
            vec!(0, 3),
            vec!(1, 4),
            vec!(3, 2)
        );

        assert_eq!(test_indexes.try_indexes_to_data(test_data, 0), vec![&5, &8]);
        assert_eq!(test_indexes.try_indexes_to_data(test_data, 1), vec![&6, &9]);
        assert_eq!(test_indexes.try_indexes_to_data(test_data, 2), vec![&8, &7]);
    }
}