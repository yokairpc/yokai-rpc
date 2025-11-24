"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POPULAR_TOKENS = void 0;
exports.getTokenBySymbol = getTokenBySymbol;
exports.getTokenByAddress = getTokenByAddress;
exports.toLamports = toLamports;
exports.fromLamports = fromLamports;
exports.POPULAR_TOKENS = {
    SOL: {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Wrapped SOL',
        decimals: 9,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    },
    USDC: {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    },
    USDT: {
        address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
    },
    BONK: {
        address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        symbol: 'BONK',
        name: 'Bonk',
        decimals: 5,
        logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I'
    },
    JUP: {
        address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        symbol: 'JUP',
        name: 'Jupiter',
        decimals: 6,
        logoURI: 'https://static.jup.ag/jup/icon.png'
    }
};
function getTokenBySymbol(symbol) {
    return exports.POPULAR_TOKENS[symbol.toUpperCase()];
}
function getTokenByAddress(address) {
    return Object.values(exports.POPULAR_TOKENS).find(t => t.address === address);
}
function toLamports(amount, decimals) {
    return Math.floor(amount * Math.pow(10, decimals));
}
function fromLamports(lamports, decimals) {
    return Number(lamports) / Math.pow(10, decimals);
}
