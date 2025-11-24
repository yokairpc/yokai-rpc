import { YokaiRPCClient } from '@yokairpc/client';
import { JupiterClient } from './jupiter';
import { YokaiSDKConfig, SwapParams, SwapResult, Quote, QuoteParams } from './types';
export * from './types';
export * from './tokens';
export { JupiterClient } from './jupiter';
export { SwapHelper } from './swap';
export declare class YokaiSDK {
    private rpcClient;
    private jupiterClient;
    private swapHelper;
    constructor(config?: YokaiSDKConfig);
    /**
     * Get RPC client for low-level operations
     */
    getRPCClient(): YokaiRPCClient;
    /**
     * Get Jupiter client for advanced quote operations
     */
    getJupiterClient(): JupiterClient;
    /**
     * Execute a swap with MEV protection
     */
    swap(params: SwapParams): Promise<SwapResult>;
    /**
     * Get a quote for a swap
     */
    getQuote(params: QuoteParams): Promise<Quote>;
}
export default YokaiSDK;
