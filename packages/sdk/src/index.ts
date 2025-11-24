import { YokaiRPCClient } from '@yokairpc/client';
import { JupiterClient } from './jupiter';
import { SwapHelper } from './swap';
import { YokaiSDKConfig, SwapParams, SwapResult, Quote, QuoteParams } from './types';

export * from './types';
export * from './tokens';
export { JupiterClient } from './jupiter';
export { SwapHelper } from './swap';

export class YokaiSDK {
  private rpcClient: YokaiRPCClient;
  private jupiterClient: JupiterClient;
  private swapHelper: SwapHelper;

  constructor(config?: YokaiSDKConfig) {
    this.rpcClient = new YokaiRPCClient({
      endpoint: config?.rpcEndpoint || 'https://app.yokairpc.io/api/rpc'
    });

    this.jupiterClient = new JupiterClient(
      config?.jupiterEndpoint || 'https://lite-api.jup.ag/swap/v1'
    );

    this.swapHelper = new SwapHelper(this.rpcClient, this.jupiterClient);
  }

  /**
   * Get RPC client for low-level operations
   */
  getRPCClient(): YokaiRPCClient {
    return this.rpcClient;
  }

  /**
   * Get Jupiter client for advanced quote operations
   */
  getJupiterClient(): JupiterClient {
    return this.jupiterClient;
  }

  /**
   * Execute a swap with MEV protection
   */
  async swap(params: SwapParams): Promise<SwapResult> {
    return this.swapHelper.swap(params);
  }

  /**
   * Get a quote for a swap
   */
  async getQuote(params: QuoteParams): Promise<Quote> {
    return this.jupiterClient.getQuote(params);
  }
}

export default YokaiSDK;