
// IDRX token addresses on different networks
export const IDRX_TOKENS = {
  base: "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22",
  solana: "idrxTdNftk6tYedPv2M7tCFHBVCpk5rkiNRd8yUArhr"
};

export const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// Minimal ABI for ERC20 token interactions
export const ERC20_ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  // symbol
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  // name
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  // transfer
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  }
];
