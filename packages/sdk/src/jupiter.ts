import { QuoteParams, Quote } from './types';

export class JupiterClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://lite-api.jup.ag/swap/v1') {
    this.baseUrl = baseUrl;
  }

  async getQuote(params: QuoteParams): Promise<Quote> {
    const { inputMint, outputMint, amount, slippageBps = 50 } = params;

    const queryParams = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString(),
      onlyDirectRoutes: 'false'
    });

    const response = await fetch(`${this.baseUrl}/quote?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Jupiter quote failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      inputMint: data.inputMint,
      outputMint: data.outputMint,
      inAmount: data.inAmount,
      outAmount: data.outAmount,
      priceImpactPct: data.priceImpactPct,
      route: data.routePlan?.[0]?.swapInfo?.label || 'Direct'
    };
  }

  async getSwapInstructions(quoteResponse: any, userPublicKey: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/swap-instructions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey
      })
    });

    if (!response.ok) {
      throw new Error(`Swap instructions failed: ${response.status}`);
    }

    return response.json();
  }
}