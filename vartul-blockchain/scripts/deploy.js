const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Vartul Blockchain Contracts...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy VartulToken
  console.log("\n📄 Deploying VartulToken...");
  const VartulToken = await hre.ethers.getContractFactory("VartulToken");
  const token = await VartulToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ VartulToken deployed to:", tokenAddress);

  // Deploy Staking Contract
  console.log("\n📄 Deploying Staking Contract...");
  const Staking = await hre.ethers.getContractFactory("Staking");
  const staking = await Staking.deploy(tokenAddress);
  await staking.waitForDeployment();
  const stakingAddress = await staking.getAddress();
  console.log("✅ Staking Contract deployed to:", stakingAddress);

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(50));
  console.log("VartulToken Address:", tokenAddress);
  console.log("Staking Contract Address:", stakingAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("=".repeat(50));

  // Save addresses to file for backend integration
  const fs = require("fs");
  const addresses = {
    VartulToken: tokenAddress,
    Staking: stakingAddress,
    deployer: deployer.address,
  };
  fs.writeFileSync(
    "deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n💾 Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });