import { AccountMeta, Group } from "../types";
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Provider, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";

export default abstract class Adapter<T extends Idl> {
    private readonly _connection: Connection;
    private readonly _program: Program<T>;

    public constructor(connection: Connection, programId: PublicKey, program?: Program<T>) {
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

    protected async sendTransactionAndConfirm(
        signers: anchor.web3.Signer[],
        instruction: TransactionInstruction[],
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        const sendConfig = confirmOptions ?? { commitment: this.connection.commitment };

        const transaction = new Transaction({
            feePayer: signers[0].publicKey,
            ...(await this.connection.getLatestBlockhash(sendConfig.commitment))
        });
        transaction.add(...instruction);
        transaction.sign(...signers);

        return web3.sendAndConfirmTransaction(this.connection, transaction, signers, sendConfig);
    }

    get connection() {
        return this._connection;
    }

    get program() {
        return this._program;
    }

    public abstract createProgram(programId: PublicKey, provider: Provider): Program<T>;

    public abstract generateDepositAccounts(group: Group, iMint: PublicKey, authority: PublicKey): Promise<AccountMeta[]>;
    public abstract generateRedeemAccounts(group: Group, iMint: PublicKey, authority: PublicKey): Promise<AccountMeta[]>;
    public abstract generateCrankAccounts(group: Group, iMint: PublicKey): Promise<AccountMeta[]>;
    public abstract generateCrankEditPhaseAccounts(group: Group, iMint: PublicKey): Promise<AccountMeta[]>;
}