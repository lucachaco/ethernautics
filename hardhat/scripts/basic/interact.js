const hre = require("hardhat");

async function main() {
    const greeterAddress = process.argv[2]; // Pass contract address as argument
    const newGreeting = process.argv[3]; // Pass new greeting as argument (optional)
    if (!greeterAddress) {
        console.error("Usage: node interact.js <greeterAddress> [newGreeting]");
        process.exit(1);
    }
    const Greeter = await hre.ethers.getContractFactory("Greeter");
    const greeter = await Greeter.attach(greeterAddress);

    // Read current greeting
    const currentGreeting = await greeter.greet();
    console.log("Current greeting:", currentGreeting);

    // Optionally set a new greeting
    if (newGreeting) {
        const tx = await greeter.setGreeting(newGreeting);
        await tx.wait();
        console.log("Greeting updated to:", newGreeting);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 