// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VartulToken
 * @dev ERC-20 token for the Vartul social media platform
 * - Symbol: VRT
 * - Decimals: 18
 * - Total Supply: 1,000,000,000 VRT (1 billion)
 */
contract VartulToken is ERC20, Ownable {
    // Total supply: 1 billion tokens
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;

    constructor() ERC20("Vartul Token", "VRT") Ownable(msg.sender) {
        // Mint total supply to contract deployer (admin)
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @dev Mint new tokens (only owner can mint)
     * Used for allocating signup bonuses and rewards
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    /**
     * @dev Burn tokens from sender's account
     * Can be used for deflationary mechanics
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}