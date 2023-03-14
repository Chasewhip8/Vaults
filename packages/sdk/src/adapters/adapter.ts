import { AccountMeta, Group } from "../types";
import { PublicKey } from "@solana/web3.js";

export default abstract class Adapter {
    public abstract generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey): AccountMeta[];
    public abstract generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey): AccountMeta[];
    public abstract generateCrankAccounts(group: Group, iMint: PublicKey): AccountMeta[];
    public abstract generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey): AccountMeta[];
}