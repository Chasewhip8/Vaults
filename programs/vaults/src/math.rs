use std::convert::TryInto;

// Thank you Bonfida for some nice FP32 math utils examples.
// https://github.com/Bonfida/bonfida-utils/blob/main/utils/src/fp_math.rs

pub const FP_32_ONE: u64 = 1 << 32;

pub trait FP32 {
    fn fp32_mul_floor(self, b_fp32: u64) -> Option<u64>;

    fn fp32_div(self, b_fp32: u64) -> Option<u64>;
}

impl FP32 for u64 {
    /// a is fp0, b is fp32 and result is a*b fp0
    fn fp32_mul_floor(self, b_fp32: u64) -> Option<u64> {
        (self as u128)
            .checked_mul(b_fp32 as u128)
            .and_then(|x| (x >> 32).try_into().ok())
    }

    fn fp32_div(self, b_fp32: u64) -> Option<u64> {
        ((self as u128) << 32)
            .checked_div(b_fp32 as u128)
            .and_then(|x| x.try_into().ok())
    }
}

#[test]
fn test() {
    // fp32_div
    assert_eq!(124345678765454_u64.fp32_div(45654 << 32).unwrap(), 2723653541);
    assert_eq!(124345678765454_u64.fp32_div(6787654 << 32).unwrap(), 18319389);

    // fp32_calc_min_tick_sizes
    assert_eq!(fp32_calc_min_tick_sizes(0), 1 << 32);
    assert_eq!(fp32_calc_min_tick_sizes(1), 1 << 31);

    // fp32_mul
    assert_eq!(
        5676543_u64.fp32_mul_floor(6787654 << 32).unwrap(),
        38530409800122
    );
    assert_eq!(12454_u64.fp32_mul_floor(45654 << 32).unwrap(), 568574916);
    assert_eq!(5_u64.fp32_mul_floor(1 << 31).unwrap(), 2);
}

pub fn calc_deposit_return(
    deposit_amount: u64,
    i_supply: u64,
    provider_ratio_fp32: u64,
    provider_balance: u64
) -> u64 {
    deposit_amount
        .checked_mul(i_supply)
        .unwrap()
        .fp32_mul_floor(provider_ratio_fp32)
        .unwrap()
        .checked_div(provider_balance)
        .unwrap()
}

pub struct AmountAfterFees {
    pub gross: u64,
    pub net: u64,
    pub fees: u64,
}

/// # Arguments
///
/// * `redeem_amount`: The amount of lamports being redeemed, either i or i + j.
/// * `i_supply`: The supply of the i mint
/// * `fee_rate_fp32`: The fee rate as a fixed point 32 number.
/// * `provider_ratio_fp32`: The provider composition ration as a fixed point 32 number.
/// * `provider_balance`: The balance of the providers deposit, this does not need to be a balance but a linear variable that grows with deposits and yield.
///
/// returns: AmountAfterFees
pub fn calc_redeem_return(
    redeem_amount: u64,
    i_supply: u64,
    fee_rate_fp32: u64,
    provider_ratio_fp32: u64,
    provider_balance: u64,
) -> AmountAfterFees {
    let gross = redeem_amount
        .checked_mul(provider_balance)
        .unwrap()
        .fp32_div(i_supply)
        .unwrap()
        .fp32_div(provider_ratio_fp32)
        .unwrap();

    calculate_fees(gross, fee_rate_fp32)
}

fn calculate_fees(gross: u64, fee_rate_fp32: u64) -> AmountAfterFees {
    let fees = gross.fp32_mul_floor(fee_rate_fp32).unwrap();

    AmountAfterFees {
        gross,
        fees,
        net: gross.checked_sub(fees).unwrap()
    }
}

// TODO unit tests for math
