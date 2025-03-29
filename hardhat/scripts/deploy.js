const hre = require("hardhat");

async function main() {
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello world!");

    await greeter.deployed();
    console.log("Greeter deployed to:", greeter.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});