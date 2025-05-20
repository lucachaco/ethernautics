// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./StakingToken.sol";

contract StakingSystem is Ownable {
    StakingToken public stakingToken;
    
    // Staking period in seconds (30 days)
    uint256 public constant STAKING_PERIOD = 30 days;
    
    // Reward rate (5% per staking period)
    uint256 public constant REWARD_RATE = 5;
    
    // Staking info for each user
    struct StakingInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastRewardTime;
        uint256 accumulatedRewards;
    }
    
    // Mapping of user to their staking info
    mapping(address => StakingInfo) public stakingInfo;
    
    // Events
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    
    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = StakingToken(_stakingToken);
    }
    
    // Function to stake tokens
    function stake(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer tokens from user to contract
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Update staking info
        StakingInfo storage info = stakingInfo[msg.sender];
        info.amount += amount;
        info.startTime = block.timestamp;
        info.lastRewardTime = block.timestamp;
        
        emit Staked(msg.sender, amount);
    }
    
    // Function to unstake tokens
    function unstake() external {
        StakingInfo storage info = stakingInfo[msg.sender];
        require(info.amount > 0, "No tokens staked");
        require(
            block.timestamp >= info.startTime + STAKING_PERIOD,
            "Staking period not ended"
        );
        
        // Calculate and transfer rewards
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            stakingToken.transfer(msg.sender, rewards);
            emit RewardsClaimed(msg.sender, rewards);
        }
        
        // Transfer staked tokens back to user
        uint256 stakedAmount = info.amount;
        info.amount = 0;
        stakingToken.transfer(msg.sender, stakedAmount);
        
        emit Unstaked(msg.sender, stakedAmount);
    }
    
    // Function to claim rewards
    function claimRewards() external {
        StakingInfo storage info = stakingInfo[msg.sender];
        require(info.amount > 0, "No tokens staked");
        
        uint256 rewards = calculateRewards(msg.sender);
        require(rewards > 0, "No rewards to claim");
        
        info.lastRewardTime = block.timestamp;
        info.accumulatedRewards = 0;
        
        stakingToken.transfer(msg.sender, rewards);
        emit RewardsClaimed(msg.sender, rewards);
    }
    
    // Function to calculate rewards
    function calculateRewards(address user) public view returns (uint256) {
        StakingInfo storage info = stakingInfo[user];
        if (info.amount == 0) return 0;
        
        uint256 timeStaked = block.timestamp - info.lastRewardTime;
        uint256 rewardAmount = (info.amount * REWARD_RATE * timeStaked) / 
                              (STAKING_PERIOD * 100);
        
        return rewardAmount;
    }
    
    // Function to get staking info
    function getStakingInfo(address user) external view returns (
        uint256 amount,
        uint256 startTime,
        uint256 lastRewardTime,
        uint256 accumulatedRewards
    ) {
        StakingInfo storage info = stakingInfo[user];
        return (
            info.amount,
            info.startTime,
            info.lastRewardTime,
            info.accumulatedRewards
        );
    }
}
