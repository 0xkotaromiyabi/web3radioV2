import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolTipLottery } from "../target/types/sol_tip_lottery";
import * as fs from "fs";

async function main() {
    // Use the local wallet defined in Anchor.toml
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.SolTipLottery as Program<SolTipLottery>;

    // Keypairs for the accounts that are not PDAs in the current skeleton
    const globalStateKeypair = anchor.web3.Keypair.generate();
    const epochStateKeypair = anchor.web3.Keypair.generate();

    // We'll use the provider's wallet as the treasury/vault for this init
    const treasuryPubkey = provider.wallet.publicKey;
    const prizeVaultPubkey = provider.wallet.publicKey;

    console.log("Program ID:", program.programId.toBase58());
    console.log("Authority:", provider.wallet.publicKey.toBase58());
    console.log("-----------------------------------------");

    try {
        console.log("Initializing Program...");

        const tx = await program.methods
            .initialize()
            .accounts({
                global: globalStateKeypair.publicKey,
                epoch: epochStateKeypair.publicKey,
                authority: provider.wallet.publicKey,
                treasury: treasuryPubkey,
                prizeVault: prizeVaultPubkey,
            })
            .signers([globalStateKeypair, epochStateKeypair])
            .rpc();

        console.log("Initialize TX Signature:", tx);
        console.log("-----------------------------------------");
        console.log("SUCCESS! Keep these addresses for your Frontend (PLY.tsx):");
        console.log(`Global State: ${globalStateKeypair.publicKey.toBase58()}`);
        console.log(`Epoch State:  ${epochStateKeypair.publicKey.toBase58()}`);
        console.log(`Treasury:     ${treasuryPubkey.toBase58()}`);
        console.log(`Prize Vault:  ${prizeVaultPubkey.toBase58()}`);
        console.log("-----------------------------------------");

        // Also save these to a file for convenience
        const output = {
            programId: program.programId.toBase58(),
            globalState: globalStateKeypair.publicKey.toBase58(),
            epochState: epochStateKeypair.publicKey.toBase58(),
            treasury: treasuryPubkey.toBase58(),
            prizeVault: prizeVaultPubkey.toBase58(),
            timestamp: new Date().toISOString()
        };
        fs.writeFileSync("init_output.json", JSON.stringify(output, null, 2));
        console.log("Addresses saved to sol_tip_lottery/init_output.json");

    } catch (err) {
        console.error("Initialization failed:", err);
    }
}

main();
