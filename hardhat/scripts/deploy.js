const hre = require("hardhat");

async function main() {
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello world!");

    await greeter.waitForDeployment(); // Ethers v6
    console.log("Greeter deployed to:", await greeter.getAddress()); // Ethers v6
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
