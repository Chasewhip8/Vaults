import { AccountMeta, Group } from "../types";
import { PublicKey } from "@solana/web3.js";
import TestAdapter from "./TestAdapter";
import Adapter from "./adapter";

// PublicKey -> Adapter
export const adapterRegistry: Map<string, Adapter> = new Map([
    ["test", new TestAdapter()]
]);

function compactAndGenerate(accounts: AccountMeta[][], startingAccounts?: AccountMeta[]) {
    const accountMap: Map<PublicKey, AccountMeta> = new Map();

    if (startingAccounts) {
        startingAccounts.forEach((item) => accountMap.set(item.pubkey, item));
    }

    accounts.forEach((accountArray) => {
        accountArray.forEach((account) => {
            const existing = accountMap.get(account.pubkey);
            if (existing) {
                accountMap.set(account.pubkey, {
                    pubkey: account.pubkey,
                    isWritable: account.isWritable || existing.isWritable,
                    isSigner: account.isSigner || existing.isSigner
                })
            } else {
                accountMap.set(account.pubkey, account);
            }
        })
    })

    const flatAccountArray = Array.from(accountMap.values());

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