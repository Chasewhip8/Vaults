import * as anchor from "@project-serum/anchor";
import * as seagull from "@seagullfinance/seagull";
import { BN, getProvider, Program, web3 } from "@project-serum/anchor";
import { Vaults } from "../../target/types/vaults";

async function waitForConfirm(connection: web3.Connection, ...txs: string[]){
    for (const tx of txs){
        await connection.confirmTransaction(tx, "confirmed");
    }
}

describe("vaults", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.Vaults as Program<Vaults>;

    const sdk = new seagull.SeagullVaultsProvider(
        anchor.getProvider().connection,
        program.programId
    )

    // EcxuxqKSv1DjEd7EobmGHn2qHMrmzvF79Vdj72Pc8peZ
    const vaultAuthority = web3.Keypair.fromSecretKey(Uint8Array.from(
        [31,243,110,205,136,217,214,129,35,155,144,131,222,75,36,95,170,244,52,152,103,101,220,240,190,174,106,186,126,239,251,6,202,94,122,196,101,152,134,47,36,92,50,224,205,249,209,40,47,155,96,159,72,140,87,32,84,78,91,209,146,183,85,102]
    ))

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
    it("Fetch Group!", async () => {
       group = await sdk.fetchGroup(seagull.findGroupAddress(jMintKeypair.publicKey, program.programId));

        if (!group) {
            throw Error("Unable to fetch group!");
        }

        console.log("Group: " + group.publicKey);
    });

    it("Initialize Vault!", async () => {
        await sdk.initVaultRpc(
            [vaultAuthority, iMintKeypair],
            group,
            iMintKeypair.publicKey,
            new BN(0),
            new BN(10_000),
            new BN(0),
            vaultAuthority.publicKey
        );
    });
});
