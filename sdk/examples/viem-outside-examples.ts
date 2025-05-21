import { createWalletClient, createPublicClient, http, hashMessage, type Hash } from 'viem';
import { sepolia } from 'viem/chains';
import { StakingSDKViemOutside } from '../staking-sdk-viem-outside';

/**
 * Examples of using various Viem functions with StakingSDKViemOutside
 */
async function main() {
  // Create Viem clients
  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http('https://sepolia.infura.io/v3/YOUR_API_KEY'),
    account: '0xYourPrivateKey'
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http('https://sepolia.infura.io/v3/YOUR_API_KEY')
  });

  // Initialize the SDK
  const sdk = new StakingSDKViemOutside({
    client: walletClient,
    publicClient,
    contractAddress: '0x1234...' // Your staking contract address
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
    const tx = await walletClient.sendTransaction({
      to: '0xRecipientAddress',
      value: 1000000000000000000n // 1 ETH
    });
    console.log('Transaction sent:', tx);

    // Wait for transaction
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx
    });
    console.log('Transaction receipt:', receipt);

    // 3. Message Signing
    console.log('\nMessage Signing:');
    
    // Sign a message
    const message = 'Hello Staking System';
    const signature = await walletClient.signMessage({
      message
    });
    console.log('Message signature:', signature);

    // Sign typed data (EIP-712)
    const typedData = {
      domain: {
        name: 'Staking System',
        version: '1',
        chainId: 11155111, // Sepolia
        verifyingContract: '0x1234...' // Your contract address
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
    const typedSignature = await walletClient.signTypedData(typedData);
    console.log('Typed data signature:', typedSignature);

    // 4. Event Handling
    console.log('\nEvent Handling:');
    
    // Get past events
    const events = await publicClient.getContractEvents({
      address: '0x1234...', // Your contract address
      abi: [...], // Your contract ABI
      eventName: 'Staked',
      fromBlock: 0n
    });
    console.log('Past staking events:', events);

    // Watch for new events
    const unwatch = publicClient.watchContractEvent({
      address: '0x1234...', // Your contract address
      abi: [...], // Your contract ABI
      eventName: 'Staked',
      onLogs: (logs) => console.log('New staking event:', logs)
    });

    // 5. Chain Utilities
    console.log('\nChain Utilities:');
    
    // Get block number
    const blockNumber = await publicClient.getBlockNumber();
    console.log('Current block:', blockNumber);

    // Get gas price
    const gasPrice = await publicClient.getGasPrice();
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