import { Adapter } from "./adapter";
import { PublicKey } from "@solana/web3.js";
import { AccountMeta, Group } from "../types";

export default class TestAdapter extends Adapter{
    generateEditVaultAccounts(group: Group, iMint: PublicKey) {
        return []
    }

    generateCrankAccounts(group: Group, iMint: PublicKey) {
        return []
    }

    generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
        return []
    }

    generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
        return []
    }

    generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey): AccountMeta[] {
        return [];
    }
}