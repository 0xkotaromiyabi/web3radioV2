
// Deployment script for W3R contracts
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying W3R Token and Rewards contracts...");

  // Deploy W3R Token
  const W3RToken = await ethers.getContractFactory("W3RToken");
  const w3rToken = await W3RToken.deploy();
  await w3rToken.deployed();
  console.log("W3RToken deployed to:", w3rToken.address);

  // Deploy W3R Rewards
  const W3RRewards = await ethers.getContractFactory("W3RRewards");
  const w3rRewards = await W3RRewards.deploy(w3rToken.address);
  await w3rRewards.deployed();
  console.log("W3RRewards deployed to:", w3rRewards.address);

  // Set rewards contract as minter
  await w3rToken.setMinter(w3rRewards.address, true);
  console.log("W3RRewards set as minter for W3RToken");

  // Transfer some tokens to rewards contract
  const transferAmount = ethers.utils.parseEther("1000000"); // 1M tokens
  await w3rToken.transfer(w3rRewards.address, transferAmount);
  console.log("Transferred 1M W3R tokens to rewards contract");

  console.log("Deployment completed!");
  console.log("W3RToken:", w3rToken.address);
  console.log("W3RRewards:", w3rRewards.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
