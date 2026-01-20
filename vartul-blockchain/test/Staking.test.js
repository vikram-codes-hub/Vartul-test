const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vartul Staking System - Complete Tests", function () {
  let token, staking, owner, user1, user2;
  const STAKE_AMOUNT = ethers.parseEther("1000"); // 1000 VRT
  const DURATION_7_DAYS = 7 * 24 * 60 * 60;
  const DURATION_14_DAYS = 14 * 24 * 60 * 60;
  const DURATION_30_DAYS = 30 * 24 * 60 * 60;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy token
    const VartulToken = await ethers.getContractFactory("VartulToken");
    token = await VartulToken.deploy();

    // Deploy staking
    const Staking = await ethers.getContractFactory("Staking");
    staking = await Staking.deploy(await token.getAddress());

    // Transfer tokens to users
    await token.transfer(user1.address, ethers.parseEther("50000"));
    await token.transfer(user2.address, ethers.parseEther("50000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await staking.vartulToken()).to.equal(await token.getAddress());
    });

    it("Should have correct minimum and maximum stake amounts", async function () {
      expect(await staking.MIN_STAKE()).to.equal(ethers.parseEther("100"));
      expect(await staking.MAX_STAKE()).to.equal(ethers.parseEther("10000"));
    });

    it("Should have correct duration multipliers", async function () {
      expect(await staking.durationMultipliers(DURATION_7_DAYS)).to.equal(10000);  // 1.0x
      expect(await staking.durationMultipliers(DURATION_14_DAYS)).to.equal(15000); // 1.5x
      expect(await staking.durationMultipliers(DURATION_30_DAYS)).to.equal(20000); // 2.0x
    });
  });

  describe("Staking", function () {
    it("Should allow valid staking", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      
      await expect(staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS))
        .to.emit(staking, "Staked")
        .withArgs(user1.address, STAKE_AMOUNT, DURATION_7_DAYS, anyValue, 10000);

      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT);
      expect(stakeInfo.active).to.be.true;
    });

    it("Should reject stake below minimum", async function () {
      const lowAmount = ethers.parseEther("50");
      await token.connect(user1).approve(await staking.getAddress(), lowAmount);

      await expect(
        staking.connect(user1).stake(lowAmount, DURATION_7_DAYS)
      ).to.be.revertedWith("Amount below minimum stake");
    });

    it("Should reject stake above maximum", async function () {
      const highAmount = ethers.parseEther("15000");
      await token.connect(user1).approve(await staking.getAddress(), highAmount);

      await expect(
        staking.connect(user1).stake(highAmount, DURATION_7_DAYS)
      ).to.be.revertedWith("Amount exceeds maximum stake");
    });

    it("Should reject invalid duration", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);

      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, 1 * 24 * 60 * 60) // 1 day (invalid)
      ).to.be.revertedWith("Invalid duration");
    });

    it("Should reject double staking", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT * 2n);
      
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      await expect(
        staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS)
      ).to.be.revertedWith("Already have active stake");
    });

    it("Should transfer tokens from user to contract", async function () {
      const userBalanceBefore = await token.balanceOf(user1.address);
      const contractBalanceBefore = await token.balanceOf(await staking.getAddress());

      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      const userBalanceAfter = await token.balanceOf(user1.address);
      const contractBalanceAfter = await token.balanceOf(await staking.getAddress());

      expect(userBalanceBefore - userBalanceAfter).to.equal(STAKE_AMOUNT);
      expect(contractBalanceAfter - contractBalanceBefore).to.equal(STAKE_AMOUNT);
    });

    it("Should update totalStaked correctly", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      expect(await staking.totalStaked()).to.equal(STAKE_AMOUNT);
    });
  });

  describe("Multipliers", function () {
    it("Should return correct multiplier for 7-day stake", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      expect(await staking.getUserMultiplier(user1.address)).to.equal(10000); // 1.0x
    });

    it("Should return correct multiplier for 14-day stake", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_14_DAYS);

      expect(await staking.getUserMultiplier(user1.address)).to.equal(15000); // 1.5x
    });

    it("Should return correct multiplier for 30-day stake", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_30_DAYS);

      expect(await staking.getUserMultiplier(user1.address)).to.equal(20000); // 2.0x
    });

    it("Should return 0 multiplier for user without stake", async function () {
      expect(await staking.getUserMultiplier(user2.address)).to.equal(0);
    });
  });

  describe("Unstaking", function () {
    beforeEach(async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);
    });

    it("Should allow unstaking after duration", async function () {
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [DURATION_7_DAYS]);
      await ethers.provider.send("evm_mine");

      await expect(staking.connect(user1).unstake())
        .to.emit(staking, "Unstaked")
        .withArgs(user1.address, STAKE_AMOUNT);

      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo.active).to.be.false;
    });

    it("Should reject unstaking before duration", async function () {
      await expect(
        staking.connect(user1).unstake()
      ).to.be.revertedWith("Stake still locked");
    });

    it("Should transfer tokens back to user", async function () {
      const balanceBefore = await token.balanceOf(user1.address);

      await ethers.provider.send("evm_increaseTime", [DURATION_7_DAYS]);
      await ethers.provider.send("evm_mine");

      await staking.connect(user1).unstake();

      const balanceAfter = await token.balanceOf(user1.address);
      expect(balanceAfter - balanceBefore).to.equal(STAKE_AMOUNT);
    });

    it("Should update totalStaked after unstaking", async function () {
      await ethers.provider.send("evm_increaseTime", [DURATION_7_DAYS]);
      await ethers.provider.send("evm_mine");

      await staking.connect(user1).unstake();

      expect(await staking.totalStaked()).to.equal(0);
    });

    it("Should allow restaking after unstaking", async function () {
      await ethers.provider.send("evm_increaseTime", [DURATION_7_DAYS]);
      await ethers.provider.send("evm_mine");

      await staking.connect(user1).unstake();

      // Stake again
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_14_DAYS);

      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo.active).to.be.true;
      expect(stakeInfo.multiplier).to.equal(15000);
    });
  });

  describe("Stake Status", function () {
    it("Should return true for active stake", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      expect(await staking.hasActiveStake(user1.address)).to.be.true;
    });

    it("Should return false after stake expires", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      await ethers.provider.send("evm_increaseTime", [DURATION_7_DAYS + 1]);
      await ethers.provider.send("evm_mine");

      expect(await staking.hasActiveStake(user1.address)).to.be.false;
    });

    it("Should calculate correct time remaining", async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);

      const timeRemaining = await staking.getTimeRemaining(user1.address);
      expect(timeRemaining).to.be.closeTo(DURATION_7_DAYS, 10); // Within 10 seconds
    });
  });

  describe("Slashing (Anti-Spam)", function () {
    beforeEach(async function () {
      await token.connect(user1).approve(await staking.getAddress(), STAKE_AMOUNT);
      await staking.connect(user1).stake(STAKE_AMOUNT, DURATION_7_DAYS);
    });

    it("Should allow owner to slash stake", async function () {
      await expect(staking.slash(user1.address, 10, "Spam detected"))
        .to.emit(staking, "Slashed")
        .withArgs(user1.address, STAKE_AMOUNT / 10n, "Spam detected");

      const stakeInfo = await staking.getStakeInfo(user1.address);
      expect(stakeInfo.amount).to.equal(STAKE_AMOUNT * 9n / 10n); // 90% remaining
    });

    it("Should reject slash from non-owner", async function () {
      await expect(
        staking.connect(user2).slash(user1.address, 10, "Spam")
      ).to.be.revertedWithCustomError(staking, "OwnableUnauthorizedAccount");
    });

    it("Should reject invalid slash percentage", async function () {
      await expect(
        staking.slash(user1.address, 0, "Invalid")
      ).to.be.revertedWith("Invalid percentage");

      await expect(
        staking.slash(user1.address, 101, "Invalid")
      ).to.be.revertedWith("Invalid percentage");
    });
  });

  describe("Multiple Users", function () {
    it("Should handle multiple users staking independently", async function () {
      const amount1 = ethers.parseEther("1000");
      const amount2 = ethers.parseEther("2000");

      await token.connect(user1).approve(await staking.getAddress(), amount1);
      await token.connect(user2).approve(await staking.getAddress(), amount2);

      await staking.connect(user1).stake(amount1, DURATION_7_DAYS);
      await staking.connect(user2).stake(amount2, DURATION_14_DAYS);

      const stake1 = await staking.getStakeInfo(user1.address);
      const stake2 = await staking.getStakeInfo(user2.address);

      expect(stake1.amount).to.equal(amount1);
      expect(stake2.amount).to.equal(amount2);
      expect(stake1.multiplier).to.equal(10000);
      expect(stake2.multiplier).to.equal(15000);
      expect(await staking.totalStaked()).to.equal(amount1 + amount2);
    });
  });
});

// Helper for any value in event matching
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");