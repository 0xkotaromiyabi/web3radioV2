const { PublicKey } = require('@solana/web3.js');

const programId = new PublicKey('FqUyWR1VRDbsepJE1cayAqLcdp1WuMqPKjLgbkP24ruB');
const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from('prize_vault')],
    programId
);

console.log('PDA:', pda.toBase58());
console.log('Bump:', bump);
