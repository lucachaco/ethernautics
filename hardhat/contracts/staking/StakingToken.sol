// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingToken is ERC20, Ownable {
    // Mapping to track staked amounts
    mapping(address => uint256) public stakedAmount;
    
    // Total staked tokens
    uint256 public totalStaked;
    
    // Events
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    
    constructor() ERC20("Staking Token", "STK") Ownable(msg.sender) {
        // Mint initial supply to contract creator
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
    
    // Function to mint new tokens (only owner)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    // Function to burn tokens
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
    
    // Function to stake tokens
    function stake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Update staked amounts
        stakedAmount[msg.sender] += amount;
        totalStaked += amount;
        
        emit TokensStaked(msg.sender, amount);
    }
    
    // Function to unstake tokens
    function unstake(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");
        
        // Update staked amounts
        stakedAmount[msg.sender] -= amount;
        totalStaked -= amount;
        
        // Transfer tokens back to user
        _transfer(address(this), msg.sender, amount);
        
        emit TokensUnstaked(msg.sender, amount);
    }
    
    // Function to get staked balance
    function getStakedBalance(address user) public view returns (uint256) {
        return stakedAmount[user];
    }
}
