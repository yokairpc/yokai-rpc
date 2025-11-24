import { Connection, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js';

export interface YokaiRPCConfig {
  endpoint: string;
}

export interface SendTransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export class YokaiRPCClient {
  private endpoint: string;

  constructor(config?: YokaiRPCConfig) {
    this.endpoint = config?.endpoint || 'https://app.yokairpc.io/api/rpc';
  }

  /**
   * Send a transaction with MEV protection
   */
  async sendTransaction(
    transaction: Transaction | VersionedTransaction,
    options?: SendOptions
  ): Promise<string> {
    try {
      const serialized = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });

      const base64Tx = Buffer.from(serialized).toString('base64');

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'sendTransaction',
          params: [
            base64Tx,
            {
              encoding: 'base64',
              skipPreflight: options?.skipPreflight ?? false,
              preflightCommitment: options?.preflightCommitment ?? 'confirmed',
              maxRetries: options?.maxRetries ?? 3,
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message || 'Transaction failed');
      }

      return result.result;
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error');
    }
  }

  /**
   * Create a standard Connection instance using YOKAI RPC
   */
  getConnection(): Connection {
    return new Connection(this.endpoint, 'confirmed');
  }

  /**
   * Make a generic RPC request
   */
  async request(method: string, params: any[] = []): Promise<any> {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'RPC Error');
    }

    return data.result;
  }
}

export default YokaiRPCClient;