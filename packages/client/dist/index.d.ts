import { Connection, Transaction, VersionedTransaction, SendOptions } from '@solana/web3.js';
export interface YokaiRPCConfig {
    endpoint: string;
}
export interface SendTransactionResult {
    success: boolean;
    signature?: string;
    error?: string;
}
export declare class YokaiRPCClient {
    private endpoint;
    constructor(config?: YokaiRPCConfig);
    /**
     * Send a transaction with MEV protection
     */
    sendTransaction(transaction: Transaction | VersionedTransaction, options?: SendOptions): Promise<string>;
    /**
     * Create a standard Connection instance using YOKAI RPC
     */
    getConnection(): Connection;
    /**
     * Make a generic RPC request
     */
    request(method: string, params?: any[]): Promise<any>;
}
export default YokaiRPCClient;
