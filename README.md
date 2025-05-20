# ethernautics
A digital lab for cooking up and testing Solidity smart contracts with modern toolchains like Hardhat, Truffle, Ethers.js, and more. From ERC20s to full-stack DApps — brewed on testnets.

## Project Overview
This repository is a playground for developing, deploying, and interacting with smart contracts using modern Ethereum development tools. It includes example contracts, deployment scripts, and interaction scripts, with a focus on best practices and maintainable project structure.

## Directory Structure
```
.
├── contracts/           # Solidity smart contracts (organized by feature)
│   ├── basic/
│   │   └── Greeter.sol
│   └── staking/
│       ├── StakingToken.sol
│       └── StakingSystem.sol
├── scripts/             # Hardhat scripts for deployment and interaction
│   ├── basic/
│   │   ├── deploy.js
│   │   └── interact.js
│   └── staking/
│       ├── deploy.js
│       ├── stake.js
│       ├── claimRewards.js
│       └── unstake.js
├── test/                # Hardhat test files
│   └── staking/
│       └── Staking.test.js
├── hardhat.config.js    # Hardhat configuration
├── README.md            # Project documentation
└── ...
```

## Scripts Organization & Usage
Scripts are organized by contract type for clarity and maintainability.

### Example Scripts
- `scripts/basic/deploy.js`: Deploys the Greeter contract.
- `scripts/basic/interact.js`: Interacts with the Greeter contract (read/set greeting).
- `scripts/staking/deploy.js`: Deploys StakingToken and StakingSystem contracts.
- `scripts/staking/stake.js`: Stakes tokens in the StakingSystem.
- `scripts/staking/claimRewards.js`: Claims staking rewards.
- `scripts/staking/unstake.js`: Unstakes tokens.

### Running Scripts
Use Hardhat to run scripts on a specific network (e.g., Sepolia):
```bash
npx hardhat run scripts/basic/deploy.js --network sepolia
npx hardhat run scripts/basic/interact.js --network sepolia <greeterAddress> [newGreeting]
npx hardhat run scripts/staking/deploy.js --network sepolia
npx hardhat run scripts/staking/stake.js --network sepolia <stakingSystemAddress> <stakingTokenAddress> <amount>
npx hardhat run scripts/staking/claimRewards.js --network sepolia <stakingSystemAddress>
npx hardhat run scripts/staking/unstake.js --network sepolia <stakingSystemAddress>
```

## Best Practices
- Organize contracts and scripts by feature or system
- Use clear, descriptive names for scripts
- Keep scripts focused: one script = one purpose
- Document your scripts and contract usage in the README

## Getting Started
1. Install dependencies:
   ```bash
   cd hardhat
   npm install
   ```
2. Set up your `.env` file with your private key and RPC URL for testnets.
3. Run tests:
   ```bash
   npx hardhat test
   ```
4. Deploy and interact with contracts using the scripts above.

---

Feel free to expand this playground with new contracts, scripts, and experiments as you learn and build!
