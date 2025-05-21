import { StakingSDKViemInside } from '../staking-sdk-viem-inside';

/**
 * Example usage of StakingSDKViemInside
 * This SDK manages Viem clients internally
 */
async function main() {
  // Initialize the SDK
  const sdk = new StakingSDKViemInside({
    contractAddress: '0x1234...', // Your staking contract address
    privateKey: '0xabcd...',     // Your private key
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_API_KEY'
  });

  try {
    // Stake tokens
    console.log('Staking tokens...');
    const stakeTx = await sdk.stake(1000000000000000000n); // 1 token with 18 decimals
    console.log('Stake transaction:', stakeTx);

    // Check staked balance
    const balance = await sdk.getStakedBalance('0xYourAddress');
    console.log('Staked balance:', balance.toString());

    // Check rewards
    const rewards = await sdk.getRewards('0xYourAddress');
    console.log('Available rewards:', rewards.toString());

    // Claim rewards
    console.log('Claiming rewards...');
    const claimTx = await sdk.claimRewards();
    console.log('Claim transaction:', claimTx);

    // Unstake tokens
    console.log('Unstaking tokens...');
    const unstakeTx = await sdk.unstake();
    console.log('Unstake transaction:', unstakeTx);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
main().catch(console.error); 