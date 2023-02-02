# Vault Math

## Key Assumptions and Terms
 - J tokens represent the underlying asset at expiry
 - J tokens are shared between multiple vaults.
 - I tokens represent the yield accrued over the lifespan of the individual vault
 - Deposit ratios are fixed for each vault group as changing them would imbalance the in progress vaults.

## The Math
Let's start off by reading over [Doozenwhale's](https://github.com/Jungle-Finance/jungle-staking/blob/master/doc/math.md)
fine work and understand the concepts. 

The final equation derived by Doozen was,
```
ij_return = asset_deposited * i.supply / holding_pool.balance
```
where `ij_return` is the amount of I and J tokens returned.

Let's attempt to remove the constraint of needing an account balance to track user deposits and create a
state variable `provider_balance`. Remember that each vault has a `ratio` which represents what portion of the
vault group each asset contributes. 

Now that we have this info lets rewrite the equation in the context of multiple yield providers,
```
provider_ij_return = (asset_deposited * i.supply * ratio) / provider_balance
```
Where the total returned ij will be the sum of all `provider_ij_return`.

### Implementation Note
Any Vault provider needs to be able to be cranked and update the balance represented inside of
`vault_balance`, this crank could be implemented constantly or at the time of deposit/withdraw as that is when
the value becomes needed.