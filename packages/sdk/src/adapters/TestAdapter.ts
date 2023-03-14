
import { PublicKey } from "@solana/web3.js";
import { AccountMeta, Group } from "../types";
import Adapter from "./adapter";

export default class TestAdapter extends Adapter {
    public constructor() {
        super();
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