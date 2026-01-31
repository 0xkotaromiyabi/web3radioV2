const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
    const CONTRACT_ADDRESS = "0xf6cE0304C02bBAcC817f2a90599cE700f538906F";
    const rpc = "https://sepolia.drpc.org";
    const provider = new ethers.providers.JsonRpcProvider(rpc);

    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
    console.log("Checking contract:", CONTRACT_ADDRESS);
    console.log("Wallet address (Owner):", wallet.address);

    const abi = [
        "function ownerOf(uint256 tokenId) view returns (address)",
        "function name() view returns (string)",
        "function symbol() view returns (string)"
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

    try {
        const name = await contract.name();
        const symbol = await contract.symbol();
        console.log(`Contract: ${name} (${symbol})`);

        const owner0 = await contract.ownerOf(0);
        console.log("Token ID 0 owner:", owner0);

        const owner174 = await contract.ownerOf(174);
        console.log("Token ID 174 owner:", owner174);

        if (owner0.toLowerCase() === wallet.address.toLowerCase()) {
            console.log("Confirmation: Tokens are owned by the deployer.");
        } else {
            console.log("Warning: Tokens are owned by someone else:", owner0);
        }
    } catch (error) {
        console.error("Error checking contract:", error.message);
    }
}

main();
