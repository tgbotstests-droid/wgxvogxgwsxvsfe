import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import { ethers } from 'ethers';

export interface SafeInfo {
  address: string;
  owners: string[];
  threshold: number;
  version: string;
}

export interface SafeTransaction {
  to: string;
  value: string;
  data: string;
  operation?: number;
  safeTxGas?: string;
  baseGas?: string;
  gasPrice?: string;
  gasToken?: string;
  refundReceiver?: string;
  nonce?: number;
}

export class SafeClient {
  private safe: Safe | null = null;
  private safeApiKit: SafeApiKit | null = null;
  private signer: ethers.Signer | null = null;

  async connect(
    safeAddress: string,
    rpcUrl: string,
    privateKey?: string
  ): Promise<SafeInfo> {
    // TODO: Gnosis Safe SDK v6.x requires a proper adapter implementation
    // This feature will be available in a future update
    throw new Error(
      "Gnosis Safe integration is currently under maintenance. " +
      "Safe SDK v6.x requires additional adapter implementation. " +
      "This feature will be available in the next update. " +
      "For now, please use the bot without Safe multisig functionality."
    );
  }

  async disconnect(): Promise<void> {
    this.safe = null;
    this.safeApiKit = null;
    this.signer = null;
  }

  async proposeTransaction(tx: SafeTransaction): Promise<string> {
    if (!this.safe || !this.signer) {
      throw new Error("Safe not connected");
    }

    const safeTransaction = await this.safe.createTransaction({
      transactions: [tx],
    });

    const safeTxHash = await this.safe.getTransactionHash(safeTransaction);
    const senderSignature = await this.safe.signTransactionHash(safeTxHash);

    if (this.safeApiKit) {
      const senderAddress = await this.signer.getAddress();
      await this.safeApiKit.proposeTransaction({
        safeAddress: await this.safe.getAddress(),
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress,
        senderSignature: senderSignature.data,
      });
    }

    return safeTxHash;
  }

  async executeTransaction(safeTxHash: string): Promise<string> {
    if (!this.safe || !this.safeApiKit) {
      throw new Error("Safe not connected");
    }

    const safeAddress = await this.safe.getAddress();
    const transaction = await this.safeApiKit.getTransaction(safeTxHash);
    
    const executeTxResponse = await this.safe.executeTransaction(transaction);
    const receipt = await executeTxResponse.transactionResponse?.wait();

    return receipt?.hash || '';
  }

  async getBalance(): Promise<string> {
    if (!this.safe || !this.signer) {
      throw new Error("Safe not connected");
    }

    const balance = await this.signer.provider!.getBalance(await this.safe.getAddress());
    return ethers.formatEther(balance);
  }

  async getPendingTransactions(): Promise<any[]> {
    if (!this.safe || !this.safeApiKit) {
      return [];
    }

    try {
      const safeAddress = await this.safe.getAddress();
      const pendingTxs = await this.safeApiKit.getPendingTransactions(safeAddress);
      return pendingTxs.results;
    } catch (error) {
      console.error("Failed to get pending transactions:", error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.safe !== null;
  }
}

// Singleton instance
export const safeClient = new SafeClient();
