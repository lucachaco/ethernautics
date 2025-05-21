import { type WalletClient, type PublicClient } from 'viem';
import { stakingSystemAbi } from './StakingSystemAbi';

export class StakingSDKViemOutside {
  private client: WalletClient;
  private publicClient: PublicClient;
  private contractAddress: `0x${string}`;

  constructor({
    client,
    publicClient,
    contractAddress,
  }: {
    client: WalletClient;
    publicClient: PublicClient;
    contractAddress: `0x${string}`;
  }) {
    this.client = client;
    this.publicClient = publicClient;
    this.contractAddress = contractAddress;
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