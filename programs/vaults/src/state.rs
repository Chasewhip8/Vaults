use std::cmp::{min};
use std::fmt::{Display, format, Formatter};
use anchor_lang::prelude::*;

use crate::constants::{MAX_ADAPTERS, MAX_VAULTS};
use anchor_lang::prelude::Pubkey;
use anchor_lang::solana_program::clock::UnixTimestamp;
use std::mem;
use adapter_abi::Phase;

#[account]
#[derive(Default)]
pub struct Group {
    pub j_mint: Pubkey,
    pub adapter_infos: Vec<AdapterEntry>,
    pub vaults: Vec<Vault>,
    pub bump: u8
}

impl Group {
    pub const LEN: usize = 32 + AdapterEntry::LEN * MAX_ADAPTERS + Vault::LEN * MAX_VAULTS;
}

#[macro_export]
macro_rules! gen_group_signer_seeds {
    ($group:expr) => {
        &[
             b"Group".as_ref(),
             $group.j_mint.key().as_ref(),
             &[$group.bump],
        ]
    };
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Vault {
    pub i_mint: Pubkey,
    pub phase: VaultPhase,
    pub j_balance: u64, // TODO figure out if we need to reset this at the start of a cycle
    pub start_timestamp: i64, // UnixTimestamp
    pub end_timestamp: i64, // UnixTimestamp
    pub adapters_verified: bool,
    pub fp32_fee_rate: u64
}

impl Vault {
    pub const LEN: usize = 72;
    const _LEN_CHECK: [u8; Vault::LEN] = [0; mem::size_of::<Self>()];
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

pub trait ToAccountInfos {
    fn try_indexes_to_data<'a, T: 'a>(
        &self,
        data: &'a [T],
        index: usize,
        offset: usize
    ) -> Vec<&'a T>;
}

impl ToAccountInfos for Vec<Vec<u8>> {
    fn try_indexes_to_data<'a, T: 'a>(
        &self,
        data: &'a [T],
        index: usize,
        offset: usize
    ) -> Vec<&'a T> {
        let indexes = self.get(index).unwrap();
        indexes.iter()
            .map(|index| data.get(offset + *index as usize).unwrap_or_else(|| panic!("Value does not exist in data at index! {}", offset + *index as usize)))
            .collect::<Vec<_>>()
    }
}

#[derive(PartialEq, Debug, Copy, Clone, PartialOrd, AnchorSerialize, AnchorDeserialize)]
#[repr(C)]
pub enum VaultPhase {
    PendingActive,
    Active,
    PendingExpired,
    Expired
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

    pub fn from_adapter(adapter_phase: Phase) -> Self {
        match adapter_phase {
            Phase::Active => Self::Active,
            Phase::Expired => Self::Expired,
            Phase::PendingExpired => Self::PendingExpired,
            Phase::PendingActive => Self::PendingActive,
        }
    }

    pub fn to_adapter(self) -> Phase {
        match self {
            Self::Active => Phase::Active,
            Self::Expired => Phase::Expired,
            Self::PendingExpired => Phase::PendingExpired,
            Self::PendingActive => Phase::PendingActive,
        }
    }
}

impl Display for VaultPhase {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
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

        assert_eq!(test_indexes.try_indexes_to_data(test_data, 0, 0), vec![&5, &8]);
        assert_eq!(test_indexes.try_indexes_to_data(test_data, 1, 0), vec![&6, &9]);
        assert_eq!(test_indexes.try_indexes_to_data(test_data, 2, 0), vec![&8, &7]);
    }
}