import * as anchor from "@project-serum/anchor";
import * as seagull from "@seagullfinance/seagull";
import { BN, getProvider, Program, web3 } from "@project-serum/anchor";
import { Vaults } from "../../target/types/vaults";
import ExampleAdapter from "@seagullfinance/seagull/dist/adapters/ExampleAdapter";
import {
    createAssociatedTokenAccount,
    createMint,
    mintTo
} from "@solana/spl-token";
import { assert } from "chai";
import { PublicKey } from "@solana/web3.js";

async function waitForConfirm(connection: web3.Connection, ...txs: string[]){
    for (const tx of txs){
        await connection.confirmTransaction(tx, "confirmed");
    }
}

async function getTime() {
    const account = await getProvider().connection.getAccountInfo(web3.SYSVAR_CLOCK_PUBKEY);
    return Number(account.data.readBigInt64LE(account.data.length - 8));
}

describe("vaults", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.Vaults as Program<Vaults>;

    const sdk = new seagull.SeagullVaultsProvider(
        anchor.getProvider().connection,
        program.programId
    );

    const exampleAdapterSDK = new ExampleAdapter (
        anchor.getProvider().connection
    );

    // EcxuxqKSv1DjEd7EobmGHn2qHMrmzvF79Vdj72Pc8peZ
    const vaultAuthority = web3.Keypair.fromSecretKey(Uint8Array.from(
        [31,243,110,205,136,217,214,129,35,155,144,131,222,75,36,95,170,244,52,152,103,101,220,240,190,174,106,186,126,239,251,6,202,94,122,196,101,152,134,47,36,92,50,224,205,249,209,40,47,155,96,159,72,140,87,32,84,78,91,209,146,183,85,102]
    ))

    const userKeypair = web3.Keypair.generate();
    const jMintKeypair = web3.Keypair.generate();
    const iMintKeypair = web3.Keypair.generate();

    it("Initialize Group!", async () => {
        const tx1 = await getProvider().connection.requestAirdrop(vaultAuthority.publicKey, 100 * 10 ** 9);
        await waitForConfirm(getProvider().connection, tx1);

        await sdk.initGroupRpc(
            [vaultAuthority, jMintKeypair],
            jMintKeypair.publicKey,
            9,
            vaultAuthority.publicKey
        );
    });

    let group: seagull.Group = null;

    const fetchGroup = async () => {
        group = await sdk.fetchGroup(seagull.findGroupAddress(jMintKeypair.publicKey, program.programId));

        if (!group) {
            throw Error("Unable to fetch group!");
        }
    }

    it("Fetch Group!", async () => {
        await fetchGroup();
    });

    it("Edit Group!", async () => {
        await sdk.editGroupRpc(
            [vaultAuthority],
            group,
            [
                {
                    adapter: new PublicKey("26UqMok72V1y2gAkUfwsA14twZmFdFnVREgFM7x8jVvr"),
                    ratioFp32: new BN(1).ishln(32)
                }
            ],
            vaultAuthority.publicKey
        )
    });

    it("Initialize Vault!", async () => {
        const currentTime = await getTime();

        await sdk.initVaultRpc(
            [vaultAuthority, iMintKeypair],
            group,
            iMintKeypair.publicKey,
            new BN(currentTime - 10),
            new BN(currentTime + 10_000_000),
            new BN(0),
            vaultAuthority.publicKey
        );

        await fetchGroup();

        assert(group.vaults.length == 1, "Vault not created!");
    });

    const baseMintKeypair = anchor.web3.Keypair.generate();

    it("Initialize Mints", async () => {
        const tx1 = await getProvider().connection.requestAirdrop(userKeypair.publicKey, 100 * 10 ** 9);
        await waitForConfirm(getProvider().connection, tx1);

        await createMint(
            getProvider().connection,
            vaultAuthority,
            vaultAuthority.publicKey,
            null, 9,
            baseMintKeypair
        );

        const userBaseTokenAccount = await createAssociatedTokenAccount(
            getProvider().connection, userKeypair, baseMintKeypair.publicKey, userKeypair.publicKey
        );

        const tx2 = await mintTo(getProvider().connection, userKeypair, baseMintKeypair.publicKey, userBaseTokenAccount, vaultAuthority, 100 * 10**9);

        await waitForConfirm(getProvider().connection, tx2);
    });

    it("Initialize Adapter!", async () => {
        await exampleAdapterSDK.initGroupRpc(
            [vaultAuthority],
            group,
            iMintKeypair.publicKey,
            baseMintKeypair.publicKey,
            vaultAuthority.publicKey
        );
    });

    it("Verify Adapters with Edit Vault!", async () => {
        await sdk.editVaultRpc(
            [vaultAuthority],
            group,
            iMintKeypair.publicKey,
            null,
            null,
            vaultAuthority.publicKey
        );

        await fetchGroup();

        assert(group.vaults[0].adaptersVerified, "Adapters not verified!");
    });

    it("Crank Expired -> Active!", async () => {
        await sdk.crankRpc(
            [vaultAuthority],
            group,
            iMintKeypair.publicKey,
            vaultAuthority.publicKey
        );

        await fetchGroup();

        assert.deepStrictEqual(group.vaults[0].phase, seagull.VaultPhases.Active,  "Phase did not transition to active!");
    });

    it("Deposit 1!", async () => {
         await sdk.depositRpc(
            [userKeypair],
            group,
            iMintKeypair.publicKey,
            userKeypair.publicKey,
            new BN(10 ** 9),
             { skipPreflight: true }
        )
    });

/*    it("Redeem 1!", async () => {
        await sdk.redeemRpc(
            [userKeypair],
            group,
            iMintKeypair.publicKey,
            userKeypair.publicKey,
            new BN(10 ** 9),
            new BN(10 ** 9)
        )
    });*/
});

//       console.log("Group: " + JSON.stringify(group, null, 2));