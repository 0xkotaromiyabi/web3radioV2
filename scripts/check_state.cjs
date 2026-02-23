const { Connection, PublicKey } = require('@solana/web3.js');
const anchor = require('@coral-xyz/anchor');
const fs = require('fs');

async function main() {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const globalStatePubkey = new PublicKey('61T5AiHoXDw9Z2aLbguGxKPyVNw86AMvgMZVZ8onumYz');
    const idl = JSON.parse(fs.readFileSync('./sol_tip_lottery/target/idl/sol_tip_lottery.json', 'utf8'));
    const programId = new PublicKey(idl.address || 'FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB');

    const provider = new anchor.AnchorProvider(connection, {}, { preflightCommitment: 'confirmed' });
    const program = new anchor.Program(idl, provider);

    try {
        const state = await program.account.globalState.fetch(globalStatePubkey);
        console.log('Global State Data:');
        console.log('Authority:', state.authority.toBase58());
        console.log('Treasury:', state.treasury.toBase58());
        console.log('Prize Vault:', state.prizeVault.toBase58());
    } catch (e) {
        console.error('Error fetching state:', e);
    }
}

main();
