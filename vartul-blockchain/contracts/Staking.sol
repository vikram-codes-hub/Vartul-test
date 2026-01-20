// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Staking
 * @dev Staking contract for Vartul platform
 * - Users stake VRT tokens for a fixed duration
 * - Staking enables earning rewards from platform activities
 * - Anti-spam mechanism through mandatory staking
 */
contract Staking is Ownable, ReentrancyGuard {
    IERC20 public vartulToken;

    // Staking duration options (in seconds)
    uint256 public constant DURATION_7_DAYS = 7 days;
    uint256 public constant DURATION_14_DAYS = 14 days;
    uint256 public constant DURATION_30_DAYS = 30 days;

    // Minimum stake amount (100 VRT)
    uint256 public constant MIN_STAKE = 100 * 10**18;

    // Maximum stake amount (10,000 VRT)
    uint256 public constant MAX_STAKE = 10_000 * 10**18;

    // Reward multipliers (basis points, 10000 = 1x)
    mapping(uint256 => uint256) public durationMultipliers;

    // Stake information
    struct StakeInfo {
        uint256 amount;           // Amount of tokens staked
        uint256 startTime;        // Timestamp when staking started
        uint256 duration;         // Lock duration in seconds
        uint256 endTime;          // Timestamp when staking ends
        uint256 multiplier;       // Reward multiplier for this stake
        bool active;              // Whether stake is currently active
    }

    // User stakes: user address => StakeInfo
    mapping(address => StakeInfo) public stakes;

    // Total tokens staked in the contract
    uint256 public totalStaked;

    // Events
    event Staked(
        address indexed user,
        uint256 amount,
        uint256 duration,
        uint256 endTime,
        uint256 multiplier
    );
    event Unstaked(address indexed user, uint256 amount);
    event Slashed(address indexed user, uint256 amount, string reason);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        vartulToken = IERC20(_tokenAddress);

        // Set multipliers (in basis points)
        durationMultipliers[DURATION_7_DAYS] = 10000;   // 1.0x (100%)
        durationMultipliers[DURATION_14_DAYS] = 15000;  // 1.5x (150%)
        durationMultipliers[DURATION_30_DAYS] = 20000;  // 2.0x (200%)
    }

    /**
     * @dev Stake tokens for a specific duration
     * @param amount Amount of tokens to stake
     * @param duration Lock duration (must be valid option)
     */
    function stake(uint256 amount, uint256 duration) external nonReentrant {
        require(amount >= MIN_STAKE, "Amount below minimum stake");
        require(amount <= MAX_STAKE, "Amount exceeds maximum stake");
        require(
            duration == DURATION_7_DAYS || 
            duration == DURATION_14_DAYS || 
            duration == DURATION_30_DAYS,
            "Invalid duration"
        );
        require(!stakes[msg.sender].active, "Already have active stake");

        // Transfer tokens from user to contract
        require(
            vartulToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        // Calculate end time
        uint256 endTime = block.timestamp + duration;
        uint256 multiplier = durationMultipliers[duration];

        // Create stake
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startTime: block.timestamp,
            duration: duration,
            endTime: endTime,
            multiplier: multiplier,
            active: true
        });

        totalStaked += amount;

        emit Staked(msg.sender, amount, duration, endTime, multiplier);
    }

    /**
     * @dev Unstake tokens after lock duration
     */
    function unstake() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        require(userStake.active, "No active stake");
        require(block.timestamp >= userStake.endTime, "Stake still locked");

        uint256 amount = userStake.amount;

        // Mark stake as inactive
        userStake.active = false;
        totalStaked -= amount;

        // Transfer tokens back to user
        require(vartulToken.transfer(msg.sender, amount), "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }

    /**
     * @dev Check if user has active stake
     * @param user Address to check
     * @return Whether user has active stake
     */
    function hasActiveStake(address user) external view returns (bool) {
        return stakes[user].active && block.timestamp < stakes[user].endTime;
    }

    /**
     * @dev Get user's stake information
     * @param user Address to query
     */
    function getStakeInfo(address user)
        external
        view
        returns (
            uint256 amount,
            uint256 startTime,
            uint256 endTime,
            uint256 multiplier,
            bool active
        )
    {
        StakeInfo memory userStake = stakes[user];
        return (
            userStake.amount,
            userStake.startTime,
            userStake.endTime,
            userStake.multiplier,
            userStake.active
        );
    }

    /**
     * @dev Get user's earning multiplier
     * @param user Address to query
     * @return Multiplier in basis points (10000 = 1x)
     */
    function getUserMultiplier(address user) external view returns (uint256) {
        if (!stakes[user].active || block.timestamp >= stakes[user].endTime) {
            return 0; // No active stake = no multiplier
        }
        return stakes[user].multiplier;
    }

    /**
     * @dev Calculate time remaining in stake
     * @param user Address to query
     * @return Seconds remaining (0 if unstaked or expired)
     */
    function getTimeRemaining(address user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        
        if (!userStake.active || block.timestamp >= userStake.endTime) {
            return 0;
        }
        
        return userStake.endTime - block.timestamp;
    }

    /**
     * @dev Slash tokens from a user (anti-spam penalty)
     * @param user Address to slash
     * @param percentage Percentage to slash (1-100)
     * @param reason Reason for slashing
     */
    function slash(
        address user,
        uint256 percentage,
        string calldata reason
    ) external onlyOwner {
        require(percentage > 0 && percentage <= 100, "Invalid percentage");
        StakeInfo storage userStake = stakes[user];
        require(userStake.active, "No active stake");

        uint256 slashAmount = (userStake.amount * percentage) / 100;
        userStake.amount -= slashAmount;
        totalStaked -= slashAmount;

        // Slashed tokens remain in contract (reward pool)
        emit Slashed(user, slashAmount, reason);
    }

    /**
     * @dev Emergency withdraw (only owner, for contract migration)
     */
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(vartulToken.transfer(msg.sender, amount), "Transfer failed");
    }

    /**
     * @dev Update duration multipliers
     */
    function updateMultiplier(uint256 duration, uint256 multiplier)
        external
        onlyOwner
    {
        require(
            duration == DURATION_7_DAYS || 
            duration == DURATION_14_DAYS || 
            duration == DURATION_30_DAYS,
            "Invalid duration"
        );
        durationMultipliers[duration] = multiplier;
    }
}