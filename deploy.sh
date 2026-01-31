#!/bin/bash
cd /home/kotarominami/web3radioV2
echo "Compiling contracts..."
npx hardhat compile
echo "Deploying to Sepolia..."
npx hardhat run scripts/deploy_access_pass.cjs --network sepolia
echo "Deploying to Base Mainnet..."
npx hardhat run scripts/deploy_access_pass.cjs --network base
