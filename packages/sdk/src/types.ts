import { PublicKey, SendOptions } from '@solana/web3.js';

export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export interface SwapParams {
  inputToken: string;
  outputToken: string;
  amount: number;
  slippageBps?: number;
  wallet: any;
  options?: SendOptions;
}

export interface SwapResult {
  success: boolean;
  signature?: string;
  error?: string;
  inputAmount?: number;
  outputAmount?: number;
  priceImpact?: number;
}

export interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}

export interface Quote {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct: string;
  route: string;
}

export interface YokaiSDKConfig {
  rpcEndpoint?: string;
  jupiterEndpoint?: string;
}