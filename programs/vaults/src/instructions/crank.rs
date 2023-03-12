use anchor_lang::prelude::*;
use adapter_abi::Phase;
use adapter_abi::Phase::{Active, Expired, PendingActive, PendingExpired};
use crate::cpis::{adapter_crank, adapter_edit_phase, execute_adapter_cpi};
use crate::state::{AdapterEntry, Group};

#[derive(Accounts)]
pub struct Crank<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(mut)]
    group: Box<Account<'info, Group>>,

    clock: Sysvar<'info, Clock>,
}

impl<'info> Crank<'info> {
    pub fn handle(&mut self, vault_index: u8, edit_phase_adapter_accounts: Vec<Vec<u8>>, crank_adapter_accounts: Vec<Vec<u8>>, accounts: &[AccountInfo<'info>]) -> Result<()> {
        let current_time = self.clock.unix_timestamp;
        let vault = &self.group.vaults.get(vault_index as usize).unwrap();

        let new_vault_phase = match (
            vault.phase,
            Phase::from_time(current_time, vault.start_timestamp, vault.end_timestamp) // Expected Phase
        ) {
            // Active -> Expired or PendingExpired -> Expired (no matter what the timestamp says)
            (Active, Expired) | (PendingExpired, _) => {
                self.switch_adapter_phase(
                    &self.group.adapter_infos,
                    &edit_phase_adapter_accounts,
                    accounts,
                    Expired,
                    PendingExpired
                )
            },
            // Expired -> Active or PendingActive -> Active (no matter what the timestamp says)
            (Expired, Active) | (PendingActive, _) => {
                self.switch_adapter_phase(
                    &self.group.adapter_infos,
                    &edit_phase_adapter_accounts,
                    accounts,
                    Active,
                    PendingActive
                )
            },
            _ => vault.phase
        };

        // If the phase is different, change it and log.
        if new_vault_phase != vault.phase {
            msg!("Transitioning from {} to {} for vault {}", vault.phase, new_vault_phase, vault_index);
            let vault = &mut self.group.vaults.get_mut(vault_index as usize).unwrap();
            vault.phase = new_vault_phase;
        }

        // Crank the adapters
        execute_adapter_cpi(
            &self.group.adapter_infos,
            &crank_adapter_accounts, accounts,
            |_, adapter_program, adapter_accounts| {
                adapter_crank(
                    &self.payer,
                    adapter_program,
                    adapter_accounts
                ).expect("Adapter crank failed!");
            }
        );

        Ok(())
    }

    fn switch_adapter_phase(
        &self,
        adapter_infos: &Vec<AdapterEntry>,
        edit_phase_adapter_accounts: &Vec<Vec<u8>>,
        accounts: &[AccountInfo<'info>],
        new_phase: Phase,
        fallback_vault_phase: Phase
    ) -> Phase {
        let mut made_full_transition = true;

        execute_adapter_cpi(
            adapter_infos,
            &edit_phase_adapter_accounts, accounts,
            |_, adapter_program, adapter_accounts| {
                let new_adapter_phase = adapter_edit_phase(
                    &self.group,
                    adapter_program,
                    adapter_accounts,
                    new_phase
                ).expect("Adapter phase edit failed!").get();

                if new_adapter_phase != new_phase {
                    made_full_transition = false;
                }
            }
        );

        // Request a transition to new_phase from all adapters, if one fails we enter fallback instead
        match made_full_transition {
            true => new_phase,
            _ => fallback_vault_phase
        }
    }
}