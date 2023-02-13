use anchor_lang::prelude::*;
use adapter::*;
use instructions::*;

mod instructions;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod marinade_stake_adapter {
    use super::*;

    deposit_ix!();
}