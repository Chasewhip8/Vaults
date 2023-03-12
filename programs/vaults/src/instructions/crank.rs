use anchor_lang::prelude::*;
use solana_program::clock::UnixTimestamp;
use adapter_abi::Phase;
use adapter_abi::Phase::{Active, Expired};
use crate::state::{Group, ToAccountInfos};

#[derive(Accounts)]
pub struct Crank<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(mut)]
    group: Box<Account<'info, Group>>,

    clock: Sysvar<'info, Clock>,
}

impl<'info> Crank<'info> {
    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn handle(&mut self, edit_phase_adapter_accounts: Vec<Vec<u8>>, accounts: &[AccountInfo<'info>]) -> Result<()> {
        let current_time = self.clock.unix_timestamp;
        for vault in self.group.vaults.iter_mut() {
            match (
                vault.phase, // Current Phase
                Phase::from_time(current_time, vault.start_timestamp, vault.end_timestamp) // Expected Phase
            ) {
                (Phase::Active, Phase::Expired) => { // Active -> Expired
                    // Request a transition to expired from all adapters, if one fails we enter PendingExpired instead



                },
                (Phase::Expired, Phase::Active) => { // Active -> Expired
                    vault.phase = Active;
                },
                _ => {}
            }


        }

        Ok(())
    }
}