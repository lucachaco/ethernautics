const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Staking System", function () {
  let stakingToken;
  let stakingSystem;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy StakingToken
    const StakingToken = await ethers.getContractFactory("StakingToken");
    stakingToken = await StakingToken.deploy();
    await stakingToken.waitForDeployment();

    // Deploy StakingSystem
    const StakingSystem = await ethers.getContractFactory("StakingSystem");
    stakingSystem = await StakingSystem.deploy(await stakingToken.getAddress());
    await stakingSystem.waitForDeployment();

    // Mint tokens to users
    const mintAmount = ethers.parseEther("1000");
    await stakingToken.mint(user1.address, mintAmount);
    await stakingToken.mint(user2.address, mintAmount);

    // Mint tokens to staking system for rewards
    await stakingToken.mint(await stakingSystem.getAddress(), ethers.parseEther("1000000"));
  });

  describe("StakingToken", function () {
    it("Should have correct name and symbol", async function () {
      expect(await stakingToken.name()).to.equal("Staking Token");
      expect(await stakingToken.symbol()).to.equal("STK");
    });

    it("Should allow minting by owner", async function () {
      const mintAmount = ethers.parseEther("100");
      const initialBalance = await stakingToken.balanceOf(user1.address);
      await stakingToken.mint(user1.address, mintAmount);
      expect(await stakingToken.balanceOf(user1.address)).to.equal(initialBalance + mintAmount);
    });

    it("Should not allow minting by non-owner", async function () {
      const mintAmount = ethers.parseEther("100");
      await expect(stakingToken.connect(user1).mint(user2.address, mintAmount))
        .to.be.revertedWithCustomError(stakingToken, "OwnableUnauthorizedAccount");
    });
  });

  describe("StakingSystem", function () {
    it("Should allow staking tokens", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Approve tokens
      await stakingToken.connect(user1).approve(await stakingSystem.getAddress(), stakeAmount);
      
      // Stake tokens
      await stakingSystem.connect(user1).stake(stakeAmount);
      
      // Check staking info
      const info = await stakingSystem.stakingInfo(user1.address);
      expect(info.amount).to.equal(stakeAmount);
    });

    it("Should not allow unstaking before period ends", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Approve and stake
      await stakingToken.connect(user1).approve(await stakingSystem.getAddress(), stakeAmount);
      await stakingSystem.connect(user1).stake(stakeAmount);
      
      // Try to unstake
      await expect(stakingSystem.connect(user1).unstake())
        .to.be.revertedWith("Staking period not ended");
    });

    it("Should calculate rewards correctly", async function () {
      const stakeAmount = ethers.parseEther("100");
      
      // Approve and stake
      await stakingToken.connect(user1).approve(await stakingSystem.getAddress(), stakeAmount);
      await stakingSystem.connect(user1).stake(stakeAmount);
      
      // Fast forward time
      await ethers.provider.send("evm_increaseTime", [30 * 24 * 60 * 60]); // 30 days
      await ethers.provider.send("evm_mine");
      
      // Calculate rewards
      const rewards = await stakingSystem.calculateRewards(user1.address);
      expect(rewards).to.be.gt(0);
    });
  });
});
