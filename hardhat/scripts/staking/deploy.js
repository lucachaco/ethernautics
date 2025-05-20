const hre = require("hardhat");

async function main() {
  // Deploy StakingToken
  const StakingToken = await hre.ethers.getContractFactory("StakingToken");
  const stakingToken = await StakingToken.deploy();
  await stakingToken.waitForDeployment();
  console.log("StakingToken deployed to:", await stakingToken.getAddress());

  // Deploy StakingSystem
  const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
  const stakingSystem = await StakingSystem.deploy(await stakingToken.getAddress());
  await stakingSystem.waitForDeployment();
  console.log("StakingSystem deployed to:", await stakingSystem.getAddress());

  // Mint some tokens to the staking system for rewards
  const mintAmount = hre.ethers.parseEther("1000000"); // 1 million tokens
  await stakingToken.mint(await stakingSystem.getAddress(), mintAmount);
  console.log("Minted", mintAmount.toString(), "tokens to StakingSystem for rewards");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
