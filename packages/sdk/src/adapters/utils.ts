import { AccountMeta, AdapterRegistry, Group } from "../types";
import { PublicKey } from "@solana/web3.js";

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
        adapterIndexBufferList[adapterOffset] = accountIndexBytes;
    }

    return {
        index_data: adapterIndexBufferList,
        accounts: flatAccountArray
    }
}

export async function generateDepositAccounts(registry: AdapterRegistry, group: Group, iMint: PublicKey, authority: PublicKey) {
    return compactAndGenerate(await Promise.all(group.adapterInfos.map(async (info) => {
        const adapter = registry.get(info.adapter.toBase58());
        if (!adapter) {
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateDepositAccounts(group, iMint, authority);
    })));
}

export async function generateRedeemAccounts(registry: AdapterRegistry, group: Group, iMint: PublicKey, authority: PublicKey) {
    return compactAndGenerate(await Promise.all(group.adapterInfos.map(async (info) => {
        const adapter = registry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateRedeemAccounts(group, iMint, authority);
    })));
}

export async function generateCrankAccounts(registry: AdapterRegistry, group: Group, iMint: PublicKey, startingAccounts?: AccountMeta[]) {
    return compactAndGenerate(await Promise.all(group.adapterInfos.map(async (info) => {
        const adapter = registry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateCrankAccounts(group, iMint);
    })), startingAccounts);
}

export async function generateCrankEditPhaseAccounts(registry: AdapterRegistry, group: Group, iMint: PublicKey) {
    return compactAndGenerate(await Promise.all(group.adapterInfos.map(async (info) => {
        const adapter = registry.get(info.adapter.toBase58());
        if (!adapter){
            throw Error("Adapter not found in registry! " + info.adapter.toBase58());
        }
        return adapter.generateCrankEditPhaseAccounts(group, iMint);
    })));
}