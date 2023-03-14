import { AccountMeta, Group } from "../types";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Provider } from "@project-serum/anchor";

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