use anchor_lang::prelude::*;
use crate::contexts::*;
use crate::state::{Adapter, Phase};

#[derive(Accounts)]
pub struct EditPhase<'info> {
    restricted: Restricted<'info>,

    #[account(mut)]
    adapter: Account<'info, Adapter>
}

impl<'info> EditPhase<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, new_phase: Phase) -> Result<Phase> {
        self.adapter.internal_phase = new_phase;
        Ok(new_phase)
    }
}