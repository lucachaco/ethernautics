import { createWalletClient, http, type WalletClient, type PublicClient } from 'viem';
import { sepolia } from 'viem/chains';
import { stakingSystemAbi } from './StakingSystemAbi';

export class StakingSDKViemInside {
  private client: WalletClient;
  private publicClient: PublicClient;
  private contractAddress: `0x${string}`;

  constructor({
    contractAddress,
    privateKey,
    rpcUrl,
  }: {
    contractAddress: `0x${string}`;
    privateKey: `0x${string}`;
    rpcUrl: string;
  }) {
    this.contractAddress = contractAddress;
    this.client = createWalletClient({
      chain: sepolia,
      transport: http(rpcUrl),
      account: privateKey,
    });
    this.publicClient = createWalletClient({
      chain: sepolia,
      transport: http(rpcUrl),
    });
  }

  // Write methods
  async stake(amount: bigint) {
    return this.client.writeContract({
      address: this.contractAddress,
      abi: stakingSystemAbi,
      functionName: 'stake',
      args: [amount],
    });
  }

  async unstake() {
    return this.client.writeContract({
      address: this.contractAddress,
      abi: stakingSystemAbi,
      functionName: 'unstake',
      args: [],
    });
  }

  async claimRewards() {
    return this.client.writeContract({
      address: this.contractAddress,
      abi: stakingSystemAbi,
      functionName: 'claimRewards',
      args: [],
    });
  }

  // Read methods
  async getStakedBalance(account: `0x${string}`) {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi: stakingSystemAbi,
      functionName: 'getStakedBalance',
      args: [account],
    });
  }

  async getRewards(account: `0x${string}`) {
    return this.publicClient.readContract({
      address: this.contractAddress,
      abi: stakingSystemAbi,
      functionName: 'getRewards',
      args: [account],
    });
  }
} 