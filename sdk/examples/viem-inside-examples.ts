import { createWalletClient, createPublicClient, http, hashMessage, type Hash } from 'viem';
import { sepolia } from 'viem/chains';
import { StakingSDKViemInside } from '../staking-sdk-viem-inside';

/**
 * Examples of using various Viem functions with StakingSDKViemInside
 */
async function main() {
  // Initialize the SDK
  const sdk = new StakingSDKViemInside({
    contractAddress: '0x1234...', // Your staking contract address
    privateKey: '0xabcd...',     // Your private key
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_API_KEY'
  });

  try {
    // 1. Basic Contract Interactions
    console.log('Basic Contract Interactions:');
    
    // Read staked balance
    const balance = await sdk.getStakedBalance('0xYourAddress');
    console.log('Staked balance:', balance.toString());

    // Stake tokens
    const stakeTx = await sdk.stake(1000000000000000000n);
    console.log('Stake transaction:', stakeTx);

    // 2. Transaction Handling
    console.log('\nTransaction Handling:');
    
    // Send a transaction
    const tx = await sdk.client.sendTransaction({
      to: '0xRecipientAddress',
      value: 1000000000000000000n // 1 ETH
    });
    console.log('Transaction sent:', tx);

    // Wait for transaction
    const receipt = await sdk.publicClient.waitForTransactionReceipt({
      hash: tx
    });
    console.log('Transaction receipt:', receipt);

    // 3. Message Signing
    console.log('\nMessage Signing:');
    
    // Sign a message
    const message = 'Hello Staking System';
    const signature = await sdk.client.signMessage({
      message
    });
    console.log('Message signature:', signature);

    // Sign typed data (EIP-712)
    const typedData = {
      domain: {
        name: 'Staking System',
        version: '1',
        chainId: 11155111, // Sepolia
        verifyingContract: sdk.contractAddress
      },
      types: {
        Stake: [
          { name: 'amount', type: 'uint256' },
          { name: 'timestamp', type: 'uint256' }
        ]
      },
      primaryType: 'Stake',
      message: {
        amount: 1000000000000000000n,
        timestamp: Math.floor(Date.now() / 1000)
      }
    };
    const typedSignature = await sdk.client.signTypedData(typedData);
    console.log('Typed data signature:', typedSignature);

    // 4. Event Handling
    console.log('\nEvent Handling:');
    
    // Get past events
    const events = await sdk.publicClient.getContractEvents({
      address: sdk.contractAddress,
      abi: sdk.abi,
      eventName: 'Staked',
      fromBlock: 0n
    });
    console.log('Past staking events:', events);

    // Watch for new events
    const unwatch = sdk.publicClient.watchContractEvent({
      address: sdk.contractAddress,
      abi: sdk.abi,
      eventName: 'Staked',
      onLogs: (logs) => console.log('New staking event:', logs)
    });

    // 5. Chain Utilities
    console.log('\nChain Utilities:');
    
    // Get block number
    const blockNumber = await sdk.publicClient.getBlockNumber();
    console.log('Current block:', blockNumber);

    // Get gas price
    const gasPrice = await sdk.publicClient.getGasPrice();
    console.log('Current gas price:', gasPrice.toString());

    // 6. Hash Functions
    console.log('\nHash Functions:');
    
    // Hash a message
    const messageHash = hashMessage(message);
    console.log('Message hash:', messageHash);

    // Hash typed data
    const typedDataHash = hashTypedData(typedData);
    console.log('Typed data hash:', typedDataHash);

    // Cleanup
    unwatch();

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the examples
main().catch(console.error); 