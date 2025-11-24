import { YokaiRPCClient } from '@yokairpc/client';
import { JupiterClient } from './jupiter';
import { SwapParams, SwapResult } from './types';
export declare class SwapHelper {
    private rpcClient;
    private jupiterClient;
    constructor(rpcClient: YokaiRPCClient, jupiterClient: JupiterClient);
    swap(params: SwapParams): Promise<SwapResult>;
    private deserializeInstruction;
}
