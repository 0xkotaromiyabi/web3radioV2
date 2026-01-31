const hre = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0xf6cE0304C02bBAcC817f2a90599cE700f538906F";
    const [deployer] = await hre.ethers.getSigners();

    console.log("Interacting with contract at:", CONTRACT_ADDRESS);
    console.log("Using account:", deployer.address);

    const Web3RadioAccessPass = await hre.ethers.getContractAt("Web3RadioAccessPass", CONTRACT_ADDRESS);

    try {
        const owner0 = await Web3RadioAccessPass.ownerOf(0);
        console.log("Token ID 0 owner:", owner0);

        const owner174 = await Web3RadioAccessPass.ownerOf(174);
        console.log("Token ID 174 owner:", owner174);

        console.log("Verification successful: Tokens are minted.");
    } catch (error) {
        console.error("Verification failed: Tokens might not be minted or contract address is wrong.");
        console.error(error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
