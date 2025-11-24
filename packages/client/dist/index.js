"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YokaiRPCClient = void 0;
const web3_js_1 = require("@solana/web3.js");
class YokaiRPCClient {
    constructor(config) {
        this.endpoint = config?.endpoint || 'https://app.yokairpc.io/api/rpc';
    }
    /**
     * Send a transaction with MEV protection
     */
    async sendTransaction(transaction, options) {
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
        }
        catch (error) {
            throw error instanceof Error ? error : new Error('Unknown error');
        }
    }
    /**
     * Create a standard Connection instance using YOKAI RPC
     */
    getConnection() {
        return new web3_js_1.Connection(this.endpoint, 'confirmed');
    }
    /**
     * Make a generic RPC request
     */
    async request(method, params = []) {
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
exports.YokaiRPCClient = YokaiRPCClient;
exports.default = YokaiRPCClient;
