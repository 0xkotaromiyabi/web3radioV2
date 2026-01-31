const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const Web3RadioAccessPass = await hre.ethers.getContractFactory("Web3RadioAccessPass");
    const accessPass = await Web3RadioAccessPass.deploy(deployer.address);

    await accessPass.waitForDeployment();

    const address = await accessPass.getAddress();
    console.log("Web3RadioAccessPass deployed to:", address);

    console.log(`\nTo verify, run: npx hardhat verify --network ${hre.network.name} ${address} ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
