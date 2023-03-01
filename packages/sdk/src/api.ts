import * as anchor from "@project-serum/anchor";

import { AnchorProvider, BN, Program, Provider } from "@project-serum/anchor";
import {
    Commitment,
    ConfirmOptions,
    Connection,
    PublicKey,
    sendAndConfirmTransaction, Signer,
    Transaction,
    TransactionInstruction,
    TransactionSignature
} from "@solana/web3.js";
import { IDL, Vaults } from "./idl/seagull_vaults_v1";
import { Group } from "./types";
import { VAULT_AUTHORITY } from "./constants";

export class SeagullVaultsProvider {
    private readonly _connection: Connection;
    private readonly _program: Program<Vaults>;

    public constructor(connection: Connection, programId: PublicKey, program?: Program<Vaults>) {
        this._connection = connection;
        this._program = program ?? this.createProgram(
            programId,
            new AnchorProvider(
                connection,
                {
                    publicKey: PublicKey.default,
                    signTransaction(): Promise<Transaction> {
                        return Promise.reject();
                    },
                    signAllTransactions(): Promise<Transaction[]> {
                        return Promise.reject();
                    }
                },
                { commitment: connection.commitment }
            )
        );
    }

    public async sendTransaction<ARGS extends any[]>(
        keypair: Signer[],
        sendConfig: ConfirmOptions,
        instructionFunction: (...args: ARGS) => Promise<TransactionInstruction>,
        ...args: ARGS
    ): Promise<TransactionSignature> {
        const ix: TransactionInstruction = await instructionFunction.apply(this, args);
        const transaction = new Transaction({
            feePayer: keypair[0].publicKey,
            ...await this.connection.getLatestBlockhash(sendConfig.commitment)
        });
        transaction.add(ix);
        transaction.sign(...keypair);

        return sendAndConfirmTransaction(this.connection, transaction, keypair, sendConfig);
    }

    get connection() {
        return this._connection;
    }

    get program() {
        return this._program;
    }

    public createProgram(programId: PublicKey, provider: Provider): Program<Vaults> {
        return new anchor.Program(IDL, programId, provider);
    }

    public async fetchGroup(
        address: PublicKey,
        commitment?: Commitment
    ): Promise<Group> {
        // @ts-ignore
        return {
            ...(await this.program.account.group.fetch(address, commitment)),
            publicKey: address
        };
    }

    public initGroup(
        jMint: PublicKey,
        decimals: number,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.program.methods
            .initGroup(decimals)
            .accounts({
                vaultAuthority: vaultAuthority,
                jMint: jMint
            })
            .instruction();
    }

    public initVault(
        group: Group,
        iMint: PublicKey,
        startTimestamp: BN,
        endTimestamp: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.program.methods
            .initVault(startTimestamp, endTimestamp)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey,
                iMint: iMint,
                jMint: group.jMint
            })
            .instruction();
    }
}