use anchor_lang::prelude::Pubkey;
use anchor_spl::token::spl_token::solana_program::pubkey;

pub const VAULT_AUTHORITY: Pubkey = pubkey!("D8564vvx7TjRur7E1aLvVfhvab2TRp7rst2zsYvjUwtt");

pub const MAX_ADAPTERS: usize = 32;
pub const MAX_VAULTS: usize = 32;
