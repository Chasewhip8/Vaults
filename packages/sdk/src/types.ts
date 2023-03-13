import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

export type AccountWithKey<T> = T & { publicKey: PublicKey };

export type TypedKeyMap<K extends string, V> = { [k in K]: V };

export type PhaseKey = "PendingActive" | "Active" | "PendingExpired" | "Expired";
export type VaultPhase = { pendingActive: {} } | { active: {} } | { pendingExpired: {} } | { expired: {} };
export const VaultPhases: TypedKeyMap<PhaseKey, VaultPhase> = {
    PendingActive: { pendingActive: {} },
    Active: { active: {} },
    PendingExpired: { pendingExpired: {} },
    Expired: { expired: {} }
};

export type Group = AccountWithKey<GroupType>;
export type GroupType = {
    jMint: PublicKey,
    adapterInfos: AdapterEntry[],
    vaults: Vault[],
    bump: number
}

export type AdapterEntry = {
    adapter: PublicKey,
    ratioFp32: BN,
}

export type Vault = {
    iMint: PublicKey,
    phase: VaultPhase,
    jBalance: BN,
    startTimestamp: BN,
    endTimestamp: BN,
    adaptersVerified: boolean,
    fp32FeeRate: BN
}

export type VaultEvent<T> = {
    data: T,
    name: string
}