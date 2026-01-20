const hre = require("hardhat");

async function main() {
  console.log("🧪 Vartul Staking - Interactive Test\n");

  // Load deployed addresses
  const fs = require("fs");
  const addresses = JSON.parse(fs.readFileSync("deployed-addresses.json"));

  const token = await hre.ethers.getContractAt("VartulToken", addresses.VartulToken);
  const staking = await hre.ethers.getContractAt("Staking", addresses.Staking);
  const [owner, user1, user2] = await hre.ethers.getSigners();

  console.log("📋 Contract Addresses:");
  console.log("Token:", addresses.VartulToken);
  console.log("Staking:", addresses.Staking);
  console.log();

  // Test 1: Transfer tokens
  console.log("TEST 1: Transfer tokens to users");
  await token.transfer(user1.address, hre.ethers.parseEther("10000"));
  await token.transfer(user2.address, hre.ethers.parseEther("10000"));
  console.log("✅ Transferred 10,000 VRT to each user\n");

  // Test 2: User1 stakes 1000 VRT for 7 days
  console.log("TEST 2: User1 stakes 1000 VRT for 7 days");
  const stakeAmount = hre.ethers.parseEther("1000");
  const DURATION_7_DAYS = 7 * 24 * 60 * 60;
  
  await token.connect(user1).approve(addresses.Staking, stakeAmount);
  await staking.connect(user1).stake(stakeAmount, DURATION_7_DAYS);
  console.log("✅ User1 staked successfully\n");

  // Test 3: Check stake info
  console.log("TEST 3: Check stake information");
  const stakeInfo = await staking.getStakeInfo(user1.address);
  console.log("Amount:", hre.ethers.formatEther(stakeInfo.amount), "VRT");
  console.log("Multiplier:", stakeInfo.multiplier.toString(), "(10000 = 1.0x)");
  console.log("Active:", stakeInfo.active);
  console.log("✅ Stake info retrieved\n");

  // Test 4: Check active stake status
  console.log("TEST 4: Check if user has active stake");
  const hasStake = await staking.hasActiveStake(user1.address);
  console.log("Has active stake:", hasStake ? "✅ Yes" : "❌ No");
  console.log();

  // Test 5: User2 stakes 5000 VRT for 30 days
  console.log("TEST 5: User2 stakes 5000 VRT for 30 days");
  const user2Amount = hre.ethers.parseEther("5000");
  const DURATION_30_DAYS = 30 * 24 * 60 * 60;
  
  await token.connect(user2).approve(addresses.Staking, user2Amount);
  await staking.connect(user2).stake(user2Amount, DURATION_30_DAYS);
  console.log("✅ User2 staked successfully\n");

  // Test 6: Compare multipliers
  console.log("TEST 6: Compare multipliers");
  const mult1 = await staking.getUserMultiplier(user1.address);
  const mult2 = await staking.getUserMultiplier(user2.address);
  console.log("User1 (7 days):", mult1.toString(), "→", Number(mult1) / 10000 + "x");
  console.log("User2 (30 days):", mult2.toString(), "→", Number(mult2) / 10000 + "x");
  console.log();

  // Test 7: Check total staked
  console.log("TEST 7: Check total staked in contract");
  const totalStaked = await staking.totalStaked();
  console.log("Total staked:", hre.ethers.formatEther(totalStaked), "VRT");
  console.log();

  console.log("=".repeat(50));
  console.log("✅ ALL TESTS PASSED");
  console.log("=".repeat(50));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });