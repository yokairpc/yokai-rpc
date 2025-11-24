import { QuoteParams, Quote } from './types';
export declare class JupiterClient {
    private baseUrl;
    constructor(baseUrl?: string);
    getQuote(params: QuoteParams): Promise<Quote>;
    getSwapInstructions(quoteResponse: any, userPublicKey: string): Promise<any>;
}
