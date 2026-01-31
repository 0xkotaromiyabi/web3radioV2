const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
    // Use a public RPC endpoint which is often more reliable for simple deployments than free tier Infura
    // Fallback list of RPCs
    const sepoliaRPCs = [
        "https://sepolia.drpc.org",
        "https://1rpc.io/sepolia",
        "https://rpc.sepolia.org",
        process.env.INFURA_API_KEY ? `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}` : null
    ].filter(Boolean);

    const baseRPCs = [
        "https://mainnet.base.org",
        "https://1rpc.io/base",
        "https://base.drpc.org"
    ];

    const networkName = process.argv[2] || "sepolia";
    let selectedRPC = null;
    let chainId = 0;
    let explorer = "";

    if (networkName === "sepolia") {
        selectedRPC = sepoliaRPCs[0]; // Start with the first one
        chainId = 11155111;
        explorer = "https://sepolia.etherscan.io";
    } else if (networkName === "base") {
        selectedRPC = baseRPCs[0];
        chainId = 8453;
        explorer = "https://basescan.org";
    } else {
        console.error(`Unknown network: ${networkName}`);
        process.exit(1);
    }

    console.log(`\n🚀 Deploying to ${networkName}...`);
    console.log(`Using RPC: ${selectedRPC}`);

    // Setup provider (ethers v5 syntax)
    const provider = new ethers.providers.StaticJsonRpcProvider(selectedRPC, {
        name: networkName,
        chainId: chainId
    });

    const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);

    console.log("Deploying with account:", wallet.address);

    // Check balance
    try {
        const balance = await wallet.getBalance();
        console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

        if (balance.isZero()) {
            console.error("\n❌ Error: Account has zero balance. Please fund your account first.");
            process.exit(1);
        }
    } catch (error) {
        console.warn("Warning: Could not check balance:", error.message);
        console.warn("Proceeding anyway...");
    }

    // Load contract artifacts
    const artifactPath = path.join(__dirname, "../artifacts/contracts/Web3RadioAccessPass.sol/Web3RadioAccessPass.json");

    if (!fs.existsSync(artifactPath)) {
        console.error(`\n❌ Error: Artifact not found at ${artifactPath}`);
        console.error("Please run 'npx hardhat compile' first.");
        process.exit(1);
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    // Create contract factory
    const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

    // Deploy contract
    console.log("Deploying contract...");
    const contract = await factory.deploy(wallet.address);

    console.log("Transaction hash:", contract.deployTransaction.hash);
    console.log("Waiting for deployment confirmation...");

    await contract.deployed();

    const address = contract.address;

    console.log("\n✅ Deployment successful!");
    console.log("Contract address:", address);
    console.log("Explorer:", `${explorer}/address/${address}`);
}

main().catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
});
