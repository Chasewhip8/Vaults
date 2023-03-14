import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { Group } from "../types";
import Adapter from "./adapter";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { findAdapterAccountAddress, findAssociatedTokenAddress } from "../utils";
import { ExampleStakeAdapter } from "../idl/example_stake_adapter";
import * as anchor from "@project-serum/anchor";
import { IDL } from "../idl/example_stake_adapter";
import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

export default class ExampleAdapter extends Adapter<ExampleStakeAdapter> {
    public constructor(connection: Connection, programId?: PublicKey, program?: Program<ExampleStakeAdapter>) {
        super(connection, programId ?? new PublicKey("26UqMok72V1y2gAkUfwsA14twZmFdFnVREgFM7x8jVvr"), program);
    }

    createProgram(programId: PublicKey, provider: Provider): Program<ExampleStakeAdapter> {
        return new anchor.Program(IDL, programId, provider);
    }

    public initialize(group: Group, iMint: PublicKey, baseMint: PublicKey, payer: PublicKey): Promise<TransactionInstruction> {
        return this.program.methods
            .initialize()
            .accounts({
                payer: payer,
                iMint: iMint,
                baseMint: baseMint,
                adapter: findAdapterAccountAddress(iMint, this.program.programId)
            })
            .instruction()
    }

    public async initGroupRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        baseMint: PublicKey,
        payer: PublicKey,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return this.sendTransactionAndConfirm(
            signers,
            [await this.initialize(group, iMint, baseMint, payer)],
            confirmOptions
        );
    }

    async generateCrankAccounts(group: Group, iMint: PublicKey) {
        return []; // Empty, uses default from vault program!
    }

    async generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
        const adapterAccountAddress = findAdapterAccountAddress(iMint, this.program.programId);
        const adapterAccount = await this.program.account.adapter.fetch(adapterAccountAddress);

        return [
            // user
            {
                pubkey: authority,
                isSigner: true,
                isWritable: false,
            },
            // stake_account
            {
                pubkey: adapterAccount.stakeAccount,
                isSigner: false,
                isWritable: true,
            },
            // user_account
            {
                pubkey: findAssociatedTokenAddress(authority, adapterAccount.baseMint),
                isSigner: false,
                isWritable: true,
            },
            // adapter
            {
                pubkey: adapterAccountAddress,
                isSigner: false,
                isWritable: false
            },
            // token program
            {
                pubkey: TOKEN_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            }
        ]
    }

    async generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey) {
        const adapterAccountAddress = findAdapterAccountAddress(iMint, this.program.programId);
        const adapterAccount = await this.program.account.adapter.fetch(adapterAccountAddress);

        return [
            // user
            {
                pubkey: authority,
                isSigner: true,
                isWritable: true
            },
            // stake_account
            {
                pubkey: adapterAccount.stakeAccount,
                isSigner: false,
                isWritable: true,
            },
            // user_account
            {
                pubkey: findAssociatedTokenAddress(authority, adapterAccount.baseMint),
                isSigner: false,
                isWritable: true,
            },
            // base_mint
            {
                pubkey: adapterAccount.baseMint,
                isWritable: false,
                isSigner: false
            },
            // adapter
            {
                pubkey: adapterAccountAddress,
                isSigner: false,
                isWritable: false
            },
            // token program
            {
                pubkey: TOKEN_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            // associated_token_program
            {
                pubkey: ASSOCIATED_PROGRAM_ID,
                isWritable: false,
                isSigner: false
            },
            // system_program
            {
                pubkey: new PublicKey("11111111111111111111111111111111"),
                isWritable: false,
                isSigner: false
            }
        ]
    }

    async generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey) {
        const adapterAccountAddress = findAdapterAccountAddress(iMint, this.program.programId);

        return [
            // adapter
            {
                pubkey: adapterAccountAddress,
                isSigner: false,
                isWritable: true
            }
        ];
    }
}