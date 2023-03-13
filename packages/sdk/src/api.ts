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
import { AdapterEntry, Group } from "./types";
import { VAULT_AUTHORITY } from "./constants";
import { IDL, Vaults } from "./idl/vaults";

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
        fp32FeeRate: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.program.methods
            .initVault(startTimestamp, endTimestamp, fp32FeeRate)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey,
                iMint: iMint,
                jMint: group.jMint
            })
            .instruction();
    }

    public editVault(
        group: Group,
        iMint: PublicKey,
        newStartTimestamp?: BN,
        newEndTimestamp?: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        return this.program.methods
            .editVault(vaultIndex, newStartTimestamp ?? null, newEndTimestamp ?? null)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey
            })
            .instruction();
    }

    public editGroup(
        group: Group,
        iMint: PublicKey,
        newAdapters: AdapterEntry[],
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.program.methods
            .editGroup(newAdapters)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey
            })
            .instruction();
    }

    public deposit(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount: BN
    ): Promise<TransactionInstruction> {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        // TODO parse accounts
        return this.program.methods
            .deposit(vaultIndex, amount, [])
            .accounts({
                authority: authority,
                group: group.publicKey,
                jMint: group.jMint,
                iMint: iMint
            })
            .instruction();
    }

    public redeem(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount_i: BN,
        amount_j: BN
    ): Promise<TransactionInstruction> {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        // TODO parse accounts
        return this.program.methods
            .redeem(vaultIndex, amount_i, amount_j, [], [])
            .accounts({
                authority: authority,
                group: group.publicKey,
                jMint: group.jMint,
                iMint: iMint
            })
            .instruction();
    }

    public crank(
        group: Group,
        iMint: PublicKey,
        payer: PublicKey
    ): Promise<TransactionInstruction> {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        // TODO parse accounts
        return this.program.methods
            .crank(vaultIndex, [], [])
            .accounts({
                payer: payer,
                group: group.publicKey
            })
            .instruction();
    }
}