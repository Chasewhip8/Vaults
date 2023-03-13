import { AccountMeta, Group } from "../types";
import { PublicKey } from "@solana/web3.js";
import TestAdapter from "./TestAdapter";

export abstract class Adapter {
    public abstract generateEditVaultAccounts(group: Group, iMint: PublicKey): AccountMeta[];
    public abstract generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey): AccountMeta[];
    public abstract generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey): AccountMeta[];
    public abstract generateCrankAccounts(group: Group, iMint: PublicKey): AccountMeta[];
    public abstract generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey): AccountMeta[];
}

// PublicKey -> Adapter
export const adapterRegistry: Map<string, Adapter> = new Map([
    ["test", new TestAdapter()]
]);

function compactAndGenerate(accounts: AccountMeta[][], startingAccounts?: AccountMeta[]) {
    const accountSet: Set<AccountMeta> = new Set(startingAccounts);
    accounts.forEach((accountArray) => {
        accountArray.forEach((account) => {
            accountSet.add(account);
        })
    })

    const flatAccountArray = Array.from(accountSet);

    // Generate corresponding index's
    let adapterIndexBufferList = Array(accounts.length);
    for (let adapterOffset = 0; adapterOffset < accounts.length; adapterOffset++) {
        const adapterAccounts = accounts[adapterOffset];
        const accountIndexBytes = Buffer.alloc(adapterAccounts.length);
        for (let offset = 0; offset < adapterAccounts.length; offset++){
            accountIndexBytes[offset] = flatAccountArray.indexOf(adapterAccounts[offset]);
        }
        adapterIndexBufferList.push()
    }

    return {
        index_data: adapterIndexBufferList,
        accounts: flatAccountArray
    }
}

export function generateEditVaultAccounts(group: Group, iMint: PublicKey) {
    return compactAndGenerate(group.adapterInfos.map((info) => {
        const adapter = adapterRegistry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateEditVaultAccounts(group, iMint);
    }));
}

export function generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
    return compactAndGenerate(group.adapterInfos.map((info) => {
        const adapter = adapterRegistry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateDepositAccounts(group, iMint, authority);
    }));
}

export function generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
    return compactAndGenerate(group.adapterInfos.map((info) => {
        const adapter = adapterRegistry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateRedeemAccounts(group, iMint, authority);
    }));
}

export function generateCrankAccounts(group: Group, iMint: PublicKey, startingAccounts?: AccountMeta[]) {
    return compactAndGenerate(group.adapterInfos.map((info) => {
        const adapter = adapterRegistry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateCrankAccounts(group, iMint);
    }), startingAccounts);
}

export function generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey) {
    return compactAndGenerate(group.adapterInfos.map((info) => {
        const adapter = adapterRegistry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateCrankEditPhaseAccounts(group, iMint);
    }));
}