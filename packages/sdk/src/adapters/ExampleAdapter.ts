import { Connection, PublicKey } from "@solana/web3.js";
import { Group } from "../types";
import Adapter from "./adapter";
import { Program, Provider, web3 } from "@project-serum/anchor";
import { findAdapterAccountAddress, findAssociatedTokenAddress } from "../utils";
import { ExampleStakeAdapter } from "../idl/example_stake_adapter";
import * as anchor from "@project-serum/anchor";
import { IDL } from "../idl/example_stake_adapter";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

export default class ExampleAdapter extends Adapter<ExampleStakeAdapter> {
    public constructor(connection: Connection, programId?: PublicKey, program?: Program<ExampleStakeAdapter>) {
        super(connection, programId ?? new PublicKey("26UqMok72V1y2gAkUfwsA14twZmFdFnVREgFM7x8jVvr"), program);
    }

    createProgram(programId: PublicKey, provider: Provider): Program<ExampleStakeAdapter> {
        return new anchor.Program(IDL, programId, provider);
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
                isSigner: true,
                isWritable: false,
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
            // stake_account
            {
                pubkey: adapterAccount.stakeAccount,
                isSigner: false,
                isWritable: true,
            },
            // user_account
            {
                pubkey: findAssociatedTokenAddress(authority, adapterAccount.baseMint),
                isSigner: true,
                isWritable: false,
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

    async generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey) {
        const adapterAccountAddress = findAdapterAccountAddress(iMint, this.program.programId);

        return [
            // adapter
            {
                pubkey: adapterAccountAddress,
                isSigner: false,
                isWritable: false
            }
        ];
    }
}