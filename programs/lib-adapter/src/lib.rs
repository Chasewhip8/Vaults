use anchor_lang::prelude::*;

mod instructions;
mod context;
mod state;

pub use instructions::*;
pub use context::*;
pub use state::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
mod lib_adapter {

}