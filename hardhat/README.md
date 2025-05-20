# Hardhat Project

## Scripts Organization & Naming Conventions

This project organizes deployment and interaction scripts by contract type for clarity and maintainability.

### Directory Structure Example

```
hardhat/
├── contracts/
│   ├── basic/
│   │   └── Greeter.sol
│   └── staking/
│       ├── StakingToken.sol
│       └── StakingSystem.sol
├── scripts/
│   ├── basic/
│   │   ├── deploy.js
│   │   └── interact.js
│   └── staking/
│       ├── deploy.js
│       ├── stake.js
│       ├── claimRewards.js
│       └── unstake.js
```

### Naming Conventions
- **deploy.js**: For deployment scripts (one per contract or per system)
- **interact.js**: For general interaction scripts (reading/writing to contract)
- **actionName.js**: For specific actions (e.g., `stake.js`, `claimRewards.js`, `mint.js`)

### Script Descriptions
- `scripts/basic/deploy.js`: Deploys the Greeter contract.
- `scripts/basic/interact.js`: Interacts with the Greeter contract (e.g., set or get greeting).
- `scripts/staking/deploy.js`: Deploys StakingToken and StakingSystem contracts.
- `scripts/staking/stake.js`: Stakes tokens in the StakingSystem.
- `scripts/staking/claimRewards.js`: Claims staking rewards from the StakingSystem.
- `scripts/staking/unstake.js`: Unstakes tokens from the StakingSystem.

### Tips
- Keep scripts focused: one script = one purpose.
- Use subfolders for each contract/system.
- Prefix scripts with the contract name if you have many (e.g., `staking_deploy.js`).
- Use clear, descriptive names.

## Common Hardhat Commands

Here are the most useful commands for working with this project:

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy Contracts
- Deploy Greeter:
  ```bash
  npx hardhat run scripts/basic/deploy.js --network sepolia
  ```
- Deploy Staking System:
  ```bash
  npx hardhat run scripts/staking/deploy.js --network sepolia
  ```

### Interact with Contracts
- Interact with Greeter:
  ```bash
  npx hardhat run scripts/basic/interact.js --network sepolia <greeterAddress> [newGreeting]
  ```
- Stake tokens:
  ```bash
  npx hardhat run scripts/staking/stake.js --network sepolia <stakingSystemAddress> <stakingTokenAddress> <amount>
  ```
- Claim rewards:
  ```bash
  npx hardhat run scripts/staking/claimRewards.js --network sepolia <stakingSystemAddress>
  ```
- Unstake tokens:
  ```bash
  npx hardhat run scripts/staking/unstake.js --network sepolia <stakingSystemAddress>
  ```

### Clean Artifacts
```bash
npx hardhat clean
```

### Generate TypeScript Types (if using typechain)
```bash
npx hardhat typechain
```

### Run Hardhat Node (local blockchain)
```bash
npx hardhat node
```

### Deploy to Local Node
```bash
npx hardhat run scripts/basic/deploy.js --network localhost
```

---

For more details, see the [Hardhat documentation](https://hardhat.org/getting-started/).

Feel free to add more scripts as your project grows, following these conventions for clarity and maintainability. 