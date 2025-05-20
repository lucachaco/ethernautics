const hre = require("hardhat");

async function main() {
    const stakingSystemAddress = process.argv[2];
    if (!stakingSystemAddress) {
        console.error("Usage: node unstake.js <stakingSystemAddress>");
        process.exit(1);
    }
    const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
    const stakingSystem = await StakingSystem.attach(stakingSystemAddress);

    // Unstake tokens
    const tx = await stakingSystem.unstake();
    await tx.wait();
    console.log(`Unstaked tokens from StakingSystem at ${stakingSystemAddress}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 