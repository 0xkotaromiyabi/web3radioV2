
# W3R Smart Contracts

Smart contracts untuk sistem reward Web3 Radio.

## Contracts

### W3RToken.sol
- ERC20 token untuk ekosistem Web3 Radio
- Symbol: W3R
- Supply: 1 billion initial, 10 billion max
- Fitur: Minting, Pausing, Access Control

### W3RRewards.sol
- Sistem reward untuk listening time
- Reward: 100 W3R per jam mendengarkan
- Anti-cheat: Daily limits, time verification
- Oracle integration untuk tracking

## Deployment

```bash
npx hardhat run contracts/deploy.js --network base
```

## Integration dengan Frontend

Update alamat contract di `W3RTokenContext.tsx`:

```typescript
const W3R_TOKEN_ADDRESS = "YOUR_DEPLOYED_TOKEN_ADDRESS";
const W3R_REWARDS_ADDRESS = "YOUR_DEPLOYED_REWARDS_ADDRESS";
```

## Fitur Utama

1. **Listening Time Tracking**: Backend oracle update listening time
2. **Reward Distribution**: User claim 100 W3R per jam
3. **Anti-Cheat**: Daily limits dan time verification
4. **Admin Controls**: Pause, emergency withdraw, authorized updaters

## Security Features

- ReentrancyGuard untuk prevent reentrancy attacks
- Pausable untuk emergency stops
- Ownable untuk admin functions
- Daily limits untuk prevent abuse

## Testing

Contract sudah include safety checks untuk:
- Invalid addresses
- Overflow protection
- Authorization checks
- Time validation
