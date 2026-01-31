const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    // Network configuration
    const networks = {
        sepolia: {
            name: "Sepolia Testnet",
            url: "https://sepolia.infura.io/v3/4674092b7c4d4407b719266cd6032230",
            chainId: 11155111,
            explorer: "https://sepolia.etherscan.io"
        },
        base: {
            name: "Base Mainnet",
            url: "https://mainnet.base.org",
            chainId: 8453,
            explorer: "https://basescan.org"
        }
    };

    const networkName = process.argv[2] || "sepolia";
    const network = networks[networkName];

    if (!network) {
        console.error(`Unknown network: ${networkName}`);
        console.log("Available networks: sepolia, base");
        process.exit(1);
    }

    console.log(`\n🚀 Deploying to ${network.name}...`);

    // Setup provider and wallet
    const provider = new ethers.JsonRpcProvider(network.url);
    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    console.log("Deploying with account:", wallet.address);

    // Load contract artifacts
    const artifactPath = path.join(__dirname, "../artifacts/contracts/Web3RadioAccessPass.sol/Web3RadioAccessPass.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Create contract factory
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

    // Deploy contract
    console.log("Deploying contract...");
    const contract = await factory.deploy(wallet.address);

    console.log("Waiting for deployment confirmation...");
    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("\n✅ Deployment successful!");
    console.log("Contract address:", address);
    console.log("Explorer:", `${network.explorer}/address/${address}`);
    console.log("\nTo verify:");
    console.log(`npx hardhat verify --network ${networkName} ${address} ${wallet.address}`);
}

main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});
