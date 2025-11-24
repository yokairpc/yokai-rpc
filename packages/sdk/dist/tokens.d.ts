import { Token } from './types';
export declare const POPULAR_TOKENS: Record<string, Token>;
export declare function getTokenBySymbol(symbol: string): Token | undefined;
export declare function getTokenByAddress(address: string): Token | undefined;
export declare function toLamports(amount: number, decimals: number): number;
export declare function fromLamports(lamports: string | number, decimals: number): number;
