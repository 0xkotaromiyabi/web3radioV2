
// Enhanced deployment script for W3R contracts
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Starting W3R Token and Rewards contract deployment...");
  
  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy W3R Token
  console.log("\n1. Deploying W3RToken...");
  const W3RToken = await ethers.getContractFactory("W3RToken");
  const w3rToken = await W3RToken.deploy();
  await w3rToken.deployed();
  console.log("✅ W3RToken deployed to:", w3rToken.address);

  // Deploy W3R Rewards
  console.log("\n2. Deploying W3RRewards...");
  const W3RRewards = await ethers.getContractFactory("W3RRewards");
  const w3rRewards = await W3RRewards.deploy(w3rToken.address);
  await w3rRewards.deployed();
  console.log("✅ W3RRewards deployed to:", w3rRewards.address);

  // Set rewards contract as minter
  console.log("\n3. Setting up permissions...");
  await w3rToken.setMinter(w3rRewards.address, true);
  console.log("✅ W3RRewards set as minter for W3RToken");

  // Transfer tokens to rewards contract
  console.log("\n4. Funding rewards contract...");
  const transferAmount = ethers.utils.parseEther("10000000"); // 10M tokens
  await w3rToken.transfer(w3rRewards.address, transferAmount);
  console.log("✅ Transferred 10M W3R tokens to rewards contract");

  // Set authorized updater (backend oracle)
  console.log("\n5. Setting authorized updater...");
  // In production, this should be your backend oracle address
  await w3rRewards.setAuthorizedUpdater(deployer.address, true);
  console.log("✅ Deployer set as authorized updater");

  // Create deployment info
  const deploymentInfo = {
    network: process.env.HARDHAT_NETWORK || "localhost",
    timestamp: new Date().toISOString(),
    contracts: {
      W3RToken: {
        address: w3rToken.address,
        deployer: deployer.address,
        blockNumber: w3rToken.deployTransaction.blockNumber
      },
      W3RRewards: {
        address: w3rRewards.address,
        deployer: deployer.address,
        blockNumber: w3rRewards.deployTransaction.blockNumber
      }
    },
    configuration: {
      rewardInterval: 3600, // 1 hour
      rewardAmount: "100000000000000000000", // 100 W3R tokens
      maxDailyRewards: 24,
      initialTokenSupply: "1000000000000000000000000000", // 1B tokens
      maxTokenSupply: "10000000000000000000000000000" // 10B tokens
    }
  };

  // Save deployment info
  const deploymentPath = path.join(__dirname, 'deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("✅ Deployment info saved to:", deploymentPath);

  // Generate frontend config
  const frontendConfig = `// Auto-generated contract addresses
export const W3R_CONTRACTS = {
  TOKEN_ADDRESS: "${w3rToken.address}",
  REWARDS_ADDRESS: "${w3rRewards.address}",
  NETWORK: "${process.env.HARDHAT_NETWORK || "localhost"}",
  CHAIN_ID: ${process.env.CHAIN_ID || 31337}
};
`;

  const configPath = path.join(__dirname, '../src/config/contracts.ts');
  const configDir = path.dirname(configPath);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  fs.writeFileSync(configPath, frontendConfig);
  console.log("✅ Frontend config generated at:", configPath);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Summary:");
  console.log("W3RToken:", w3rToken.address);
  console.log("W3RRewards:", w3rRewards.address);
  console.log("\n📝 Next Steps:");
  console.log("1. Update frontend with new contract addresses");
  console.log("2. Set up backend oracle for listening time verification");
  console.log("3. Fund rewards contract with more tokens if needed");
  console.log("4. Verify contracts on block explorer");

  // Verification commands
  console.log("\n🔍 Verification Commands:");
  console.log(`npx hardhat verify --network ${process.env.HARDHAT_NETWORK || "localhost"} ${w3rToken.address}`);
  console.log(`npx hardhat verify --network ${process.env.HARDHAT_NETWORK || "localhost"} ${w3rRewards.address} ${w3rToken.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
