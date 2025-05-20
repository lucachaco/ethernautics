const hre = require("hardhat");

async function main() {
    const stakingSystemAddress = process.argv[2];
    const stakingTokenAddress = process.argv[3];
    const amount = process.argv[4];
    if (!stakingSystemAddress || !stakingTokenAddress || !amount) {
        console.error("Usage: node stake.js <stakingSystemAddress> <stakingTokenAddress> <amount>");
        process.exit(1);
    }
    const [signer] = await hre.ethers.getSigners();
    const StakingToken = await hre.ethers.getContractFactory("StakingToken");
    const stakingToken = await StakingToken.attach(stakingTokenAddress);
    const StakingSystem = await hre.ethers.getContractFactory("StakingSystem");
    const stakingSystem = await StakingSystem.attach(stakingSystemAddress);

    // Approve tokens
    const tx1 = await stakingToken.approve(stakingSystemAddress, amount);
    await tx1.wait();
    console.log(`Approved ${amount} tokens for staking.`);

    // Stake tokens
    const tx2 = await stakingSystem.stake(amount);
    await tx2.wait();
    console.log(`Staked ${amount} tokens in StakingSystem.`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 