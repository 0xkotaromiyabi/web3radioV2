const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error("No deployer account found. Did you set DEPLOYER_PRIVATE_KEY in your .env file?");
    }
    console.log("Deploying Marketplace with the account:", deployer.address);

    const ACCESS_PASS_ADDRESS = "0xf6cE0304C02bBAcC817f2a90599cE700f538906F";
    const USDC_ADDRESS = hre.network.name === "base"
        ? "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        : "0x1C7D4B196Cb02324016fdD330689B09BE8697a21"; // Corrected Checksum for Sepolia USDC

    const RentalMarketplace = await hre.ethers.getContractFactory("RentalMarketplace");
    const marketplace = await RentalMarketplace.deploy(ACCESS_PASS_ADDRESS, USDC_ADDRESS, deployer.address);

    await marketplace.waitForDeployment();

    const address = await marketplace.getAddress();
    console.log("RentalMarketplace deployed to:", address);

    console.log(`\nTo verify, run: npx hardhat verify --network ${hre.network.name} ${address} ${ACCESS_PASS_ADDRESS} ${USDC_ADDRESS} ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
