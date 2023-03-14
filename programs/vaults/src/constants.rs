use anchor_lang::prelude::Pubkey;
use anchor_spl::token::spl_token::solana_program::pubkey;

pub const VAULT_AUTHORITY: Pubkey = pubkey!("EcxuxqKSv1DjEd7EobmGHn2qHMrmzvF79Vdj72Pc8peZ");

pub const MAX_ADAPTERS: usize = 32;
pub const MAX_VAULTS: usize = 32;
