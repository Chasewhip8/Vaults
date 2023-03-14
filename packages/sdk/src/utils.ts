import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";

export function fp32FromNumber(amount: number): BN {
    return new BN(Math.floor(amount * (2 ** 32)));
}

export function findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
): PublicKey {
    return PublicKey.findProgramAddressSync(
        [
            new PublicKey(walletAddress).toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            new PublicKey(tokenMintAddress).toBuffer()
        ],
        ASSOCIATED_PROGRAM_ID
    )[0];
}

export function findGroupAddress(jMint: PublicKey, vaultProgramId: PublicKey){
    return findProgramAddressSync(
        [
            Buffer.from("Group"),
            jMint.toBuffer()
        ],
        vaultProgramId
    )[0]
}

export function findAdapterAccountAddress(i_Mint: PublicKey, adapterProgramId: PublicKey){
    return findProgramAddressSync(
        [
            Buffer.from("Adapter"),
            i_Mint.toBuffer()
        ],
        adapterProgramId
    )[0]
}