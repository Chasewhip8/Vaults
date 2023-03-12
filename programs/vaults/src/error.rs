use anchor_lang::error_code;

#[error_code]
pub enum VaultError {
    #[msg("Error executing CPI for adapter!")]
    AdapterCPIFail,
}