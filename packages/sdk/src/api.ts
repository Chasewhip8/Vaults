import * as anchor from "@project-serum/anchor";

import { Accounts, AnchorProvider, BN, Program, Provider, web3 } from "@project-serum/anchor";
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
import { AccountMeta, AdapterEntry, AdapterRegistry, Group } from "./types";
import { VAULT_AUTHORITY } from "./constants";
import { IDL, Vaults } from "./idl/vaults";
import {
    generateCrankAccounts,
    generateCrankEditPhaseAccounts,
    generateDepositAccounts,
    generateRedeemAccounts
} from "./adapters/utils";
import Adapter from "./adapters/adapter";
import ExampleAdapter from "./adapters/ExampleAdapter";
import { findAssociatedTokenAddress } from "./utils";

export class SeagullVaultsProvider {
    private readonly _connection: Connection;
    private readonly _program: Program<Vaults>;

    // PublicKey -> Adapter
    private readonly adapterRegistry: AdapterRegistry;

    public constructor(connection: Connection, programId: PublicKey, anchorWallet?: AnchorProvider,  program?: Program<Vaults>) {
        this._connection = connection;
        this._program = program ?? this.createProgram(
            programId,
            anchorWallet ?? new AnchorProvider(
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

        this.adapterRegistry = new Map([
            ["26UqMok72V1y2gAkUfwsA14twZmFdFnVREgFM7x8jVvr", new ExampleAdapter(this.connection)]
        ]);
    }

    private getAdapterProgramAccountMetas(group: Group): AccountMeta[] {
        return group.adapterInfos.map((key) => {
            return {
                isSigner: false,
                isWritable: false,
                pubkey: new PublicKey(key.adapter)
            }
        })
    }

    private async sendTransactionAndConfirm(
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

    private initGroupAnchor(
        jMint: PublicKey,
        decimals: number,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ) {
        return this.program.methods
            .initGroup(decimals)
            .accounts({
                vaultAuthority: vaultAuthority,
                jMint: jMint
            });
    }

    public initGroup(
        jMint: PublicKey,
        decimals: number,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.initGroupAnchor(jMint, decimals, vaultAuthority)
            .instruction();
    }

    public async initGroupRpc(
        signers: anchor.web3.Signer[],
        jMint: PublicKey,
        decimals: number,
        vaultAuthority: PublicKey = VAULT_AUTHORITY,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return this.initGroupAnchor(jMint, decimals, vaultAuthority)
            .signers(signers)
            .rpc(confirmOptions);
    }

    private initVaultAnchor(
        group: Group,
        iMint: PublicKey,
        startTimestamp: BN,
        endTimestamp: BN,
        fp32FeeRate: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ) {
        return this.program.methods
            .initVault(startTimestamp, endTimestamp, fp32FeeRate)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey,
                iMint: iMint,
                jMint: group.jMint
            });
    }

    public initVault(
        group: Group,
        iMint: PublicKey,
        startTimestamp: BN,
        endTimestamp: BN,
        fp32FeeRate: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.initVaultAnchor(group, iMint, startTimestamp, endTimestamp, fp32FeeRate, vaultAuthority)
            .instruction();
    }

    public async initVaultRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        startTimestamp: BN,
        endTimestamp: BN,
        fp32FeeRate: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return this.initVaultAnchor(group, iMint, startTimestamp, endTimestamp, fp32FeeRate, vaultAuthority)
            .signers(signers)
            .rpc(confirmOptions);
    }

    private editVaultAnchor(
        group: Group,
        iMint: PublicKey,
        newStartTimestamp?: BN,
        newEndTimestamp?: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ) {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        const adapterAccounts: AccountMeta[] = group.adapterInfos.map((info) => {
            return {
                isSigner: false,
                isWritable: false,
                pubkey: web3.PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("Adapter"),
                        iMint.toBuffer()
                    ],
                    info.adapter
                )[0]
            }
        });

        return this.program.methods
            .editVault(vaultIndex, newStartTimestamp ?? null, newEndTimestamp ?? null)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey
            })
            .remainingAccounts(adapterAccounts);
    }

    public editVault(
        group: Group,
        iMint: PublicKey,
        newStartTimestamp?: BN,
        newEndTimestamp?: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.editVaultAnchor(group, iMint, newStartTimestamp, newEndTimestamp, vaultAuthority)
            .instruction();
    }

    public async editVaultRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        newStartTimestamp?: BN,
        newEndTimestamp?: BN,
        vaultAuthority: PublicKey = VAULT_AUTHORITY,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return this.editVaultAnchor(group, iMint, newStartTimestamp, newEndTimestamp, vaultAuthority)
            .signers(signers)
            .rpc(confirmOptions);
    }

    private editGroupAnchor(
        group: Group,
        newAdapters: AdapterEntry[],
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ) {
        return this.program.methods
            .editGroup(newAdapters)
            .accounts({
                vaultAuthority: vaultAuthority,
                group: group.publicKey
            });
    }

    public editGroup(
        group: Group,
        newAdapters: AdapterEntry[],
        vaultAuthority: PublicKey = VAULT_AUTHORITY
    ): Promise<TransactionInstruction> {
        return this.editGroupAnchor(group, newAdapters, vaultAuthority)
            .instruction();
    }

    public async editGroupRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        newAdapters: AdapterEntry[],
        vaultAuthority: PublicKey = VAULT_AUTHORITY,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return this.editGroupAnchor(group, newAdapters, vaultAuthority)
            .signers(signers)
            .rpc(confirmOptions);
    }

    public async depositAnchor(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount: BN
    ) {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        const accountData = await generateDepositAccounts(this.adapterRegistry, group, iMint, authority);
        return this.program.methods
            .deposit(vaultIndex, amount, accountData.index_data)
            .accounts({
                authority: authority,
                group: group.publicKey,
                jMint: group.jMint,
                jAccount: findAssociatedTokenAddress(authority, group.jMint),
                iMint: iMint,
                iAccount: findAssociatedTokenAddress(authority, iMint)
            })
            .remainingAccounts([...this.getAdapterProgramAccountMetas(group), ...accountData.accounts]);
    }

    public async deposit(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount: BN
    ): Promise<TransactionInstruction> {
        return (await this.depositAnchor(group, iMint, authority, amount))
            .instruction();
    }

    public async depositRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount: BN,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return (await this.depositAnchor(group, iMint, authority, amount))
            .signers(signers)
            .rpc(confirmOptions);
    }

    public async redeemAnchor(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount_i: BN,
        amount_j: BN
    ) {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        const redeemAccountData = await generateRedeemAccounts(this.adapterRegistry, group, iMint, authority);
        const crankAccountData = await generateCrankAccounts(this.adapterRegistry, group, iMint, redeemAccountData.accounts); // Combine the accounts
        return this.program.methods
            .redeem(vaultIndex, amount_i, amount_j, crankAccountData.index_data, redeemAccountData.index_data)
            .accounts({
                authority: authority,
                group: group.publicKey,
                jMint: group.jMint,
                jAccount: findAssociatedTokenAddress(authority, group.jMint),
                iMint: iMint,
                iAccount: findAssociatedTokenAddress(authority, iMint)
            })
            .remainingAccounts([...this.getAdapterProgramAccountMetas(group), ...crankAccountData.accounts])
    }

    public async redeem(
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount_i: BN,
        amount_j: BN
    ): Promise<TransactionInstruction> {
        return (await this.redeemAnchor(group, iMint, authority, amount_i, amount_j))
            .instruction();
    }

    public async redeemRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        authority: PublicKey,
        amount_i: BN,
        amount_j: BN,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return (await this.redeemAnchor(group, iMint, authority, amount_i, amount_j))
            .signers(signers)
            .rpc(confirmOptions);
    }

    public async crankAnchor(
        group: Group,
        iMint: PublicKey,
        payer: PublicKey
    ) {
        const vaultIndex = group.vaults.findIndex((vault) => vault.iMint.equals(iMint));

        const editPhaseAccountData = await generateCrankEditPhaseAccounts(this.adapterRegistry, group, iMint);
        const crankAccountData = await generateCrankAccounts(this.adapterRegistry, group, iMint, editPhaseAccountData.accounts); // Combine the accounts

        return this.program.methods
            .crank(vaultIndex, editPhaseAccountData.index_data, crankAccountData.index_data)
            .accounts({
                payer: payer,
                group: group.publicKey
            })
            .remainingAccounts([...this.getAdapterProgramAccountMetas(group), ...crankAccountData.accounts]);
    }

    public async crank(
        group: Group,
        iMint: PublicKey,
        payer: PublicKey
    ): Promise<TransactionInstruction> {
        return (await this.crankAnchor(group, iMint, payer))
            .instruction();
    }

    public async crankRpc(
        signers: anchor.web3.Signer[],
        group: Group,
        iMint: PublicKey,
        payer: PublicKey,
        confirmOptions?: anchor.web3.ConfirmOptions
    ): Promise<anchor.web3.TransactionSignature> {
        return (await this.crankAnchor(group, iMint, payer))
            .signers(signers)
            .rpc(confirmOptions);
    }
}