const hre = require("hardhat");

async function main() {
    const stakingSystemAddress = process.argv[2];
    if (!stakingSystemAddress) {
        console.error("Usage: node claimRewards.js <stakingSystemAddress>");
        process.exit(1);
    }
    const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
    const stakingSystem = await StakingSystem.attach(stakingSystemAddress);

    // Claim rewards
    const tx = await stakingSystem.claimRewards();
    await tx.wait();
    console.log(`Rewards claimed from StakingSystem at ${stakingSystemAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 