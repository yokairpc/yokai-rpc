# @yokairpc/sdk

Complete toolkit for privacy-first Solana development with built-in MEV protection and Jupiter integration.

## Installation
```bash
npm install @yokairpc/sdk @solana/web3.js
```

## Quick Start
```typescript
import { YokaiSDK } from '@yokairpc/sdk';
import { Keypair } from '@solana/web3.js';

// Initialize SDK
const sdk = new YokaiSDK();

// Execute swap with one line
const wallet = Keypair.generate(); // Or your wallet adapter

const result = await sdk.swap({
  inputToken: 'SOL',
  outputToken: 'USDC',
  amount: 1.5,
  wallet: wallet,
  slippageBps: 50
});

console.log('Swap signature:', result.signature);
console.log('Output amount:', result.outputAmount);
```

## Features

- ✅ **One-Line Swaps** - Simple API for complex operations
- ✅ **MEV Protection** - Built-in protection for all transactions
- ✅ **Jupiter Integration** - Best prices across all Solana DEXs
- ✅ **Token Utilities** - Easy token lookup and conversion
- ✅ **TypeScript** - Full type safety and IntelliSense
- ✅ **Free Forever** - Unlimited requests, no API key required

## API Reference

### `new YokaiSDK(config?)`

Create a new SDK instance.
```typescript
const sdk = new YokaiSDK({
  rpcEndpoint: 'https://app.yokairpc.io/api/rpc', // optional
  jupiterEndpoint: 'https://lite-api.jup.ag/swap/v1' // optional
});
```

### `sdk.swap(params)`

Execute a swap with MEV protection.
```typescript
const result = await sdk.swap({
  inputToken: 'SOL',        // Symbol or address
  outputToken: 'USDC',      // Symbol or address
  amount: 1.5,              // Input amount
  wallet: myWallet,         // Wallet adapter or Keypair
  slippageBps: 50,          // Optional: 0.5% slippage
  options: {                // Optional: Send options
    skipPreflight: false,
    preflightCommitment: 'confirmed'
  }
});

if (result.success) {
  console.log('Signature:', result.signature);
  console.log('Output:', result.outputAmount);
  console.log('Price impact:', result.priceImpact);
} else {
  console.error('Error:', result.error);
}
```

### `sdk.getQuote(params)`

Get a quote without executing swap.
```typescript
const quote = await sdk.getQuote({
  inputMint: 'So11111111111111111111111111111111111111112',
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  amount: 1500000000, // lamports
  slippageBps: 50
});

console.log('Expected output:', quote.outAmount);
console.log('Price impact:', quote.priceImpactPct);
console.log('Route:', quote.route);
```

### `sdk.getRPCClient()`

Get underlying RPC client for low-level operations.
```typescript
const rpcClient = sdk.getRPCClient();
const connection = rpcClient.getConnection();
const balance = await connection.getBalance(publicKey);
```

### `sdk.getJupiterClient()`

Get Jupiter client for advanced operations.
```typescript
const jupiterClient = sdk.getJupiterClient();
const quote = await jupiterClient.getQuote({...});
```

## Token Utilities
```typescript
import { 
  getTokenBySymbol, 
  getTokenByAddress,
  toLamports,
  fromLamports,
  POPULAR_TOKENS 
} from '@yokairpc/sdk';

// Get token by symbol
const solToken = getTokenBySymbol('SOL');
console.log(solToken.address); // So11111111...

// Convert amounts
const lamports = toLamports(1.5, 9); // 1500000000
const amount = fromLamports('1500000000', 9); // 1.5

// Access popular tokens
console.log(POPULAR_TOKENS.USDC);
console.log(POPULAR_TOKENS.BONK);
```

## Supported Tokens

Built-in support for:
- SOL (Wrapped SOL)
- USDC (USD Coin)
- USDT (Tether)
- BONK (Bonk)
- JUP (Jupiter)

Plus any token via address!

## Advanced Usage

### Custom RPC Endpoint
```typescript
const sdk = new YokaiSDK({
  rpcEndpoint: 'https://your-instance.com/api/rpc'
});
```

### Swap with Token Addresses
```typescript
await sdk.swap({
  inputToken: 'So11111111111111111111111111111111111111112',
  outputToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  amount: 1.5,
  wallet: myWallet
});
```

### Custom Slippage
```typescript
await sdk.swap({
  inputToken: 'SOL',
  outputToken: 'USDC',
  amount: 1.5,
  wallet: myWallet,
  slippageBps: 100 // 1% slippage
});
```

## Error Handling
```typescript
const result = await sdk.swap({...});

if (!result.success) {
  console.error('Swap failed:', result.error);
  // Handle error
}
```

## TypeScript Support

Full TypeScript support with comprehensive types:
```typescript
import { SwapParams, SwapResult, Quote, Token } from '@yokairpc/sdk';
```

## Comparison with @yokairpc/client

| Feature | @yokairpc/client | @yokairpc/sdk |
|---------|------------------|---------------|
| RPC Client | ✅ | ✅ |
| MEV Protection | ✅ | ✅ |
| Jupiter Integration | ❌ | ✅ |
| One-line Swaps | ❌ | ✅ |
| Token Utilities | ❌ | ✅ |
| Quote API | ❌ | ✅ |
| Size | ~3KB | ~10KB |
| Use Case | Low-level control | Easy swaps |

## Links

- Website: [app.yokairpc.io](https://app.yokairpc.io)
- Documentation: [docs](https://app.yokairpc.io/docs.html)
- GitHub: [yokairpc/yokai-rpc](https://github.com/yokairpc/yokai-rpc)
- Twitter: [@yokairpcdotio](https://x.com/yokairpcdotio)
- NPM: [@yokairpc/sdk](https://www.npmjs.com/package/@yokairpc/sdk)

## Related Packages

- [@yokairpc/client](https://www.npmjs.com/package/@yokairpc/client) - Lightweight RPC client

## License

MIT License - see [LICENSE](../../LICENSE) for details.