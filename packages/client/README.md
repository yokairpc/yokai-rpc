# @yokairpc/client

Privacy-first Solana RPC client with built-in MEV protection.

## Installation
```bash
npm install @yokairpc/client @solana/web3.js
```

## Quick Start
```typescript
import { YokaiRPCClient } from '@yokairpc/client';
import { Transaction, SystemProgram, Keypair } from '@solana/web3.js';

// Initialize client
const client = new YokaiRPCClient();

// Get standard Connection
const connection = client.getConnection();

// Send MEV-protected transaction
const wallet = Keypair.generate();
const tx = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: wallet.publicKey,
    toPubkey: wallet.publicKey,
    lamports: 1000,
  })
);

tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
tx.sign(wallet);

const signature = await client.sendTransaction(tx);
console.log('Transaction:', signature);
```

## Features

- ✅ **MEV Protection** - Prevents sandwich attacks and frontrunning
- ✅ **Sub-100ms Latency** - Institutional-grade performance  
- ✅ **99.9% Uptime** - Enterprise reliability
- ✅ **Free Forever** - Unlimited requests, no API key required

## API

### `new YokaiRPCClient(config?)`

Create a new client instance.
```typescript
const client = new YokaiRPCClient({
  endpoint: 'https://app.yokairpc.io/api/rpc' // optional
});
```

### `client.sendTransaction(transaction, options?)`

Send a transaction with MEV protection.
```typescript
const signature = await client.sendTransaction(tx, {
  skipPreflight: false,
  preflightCommitment: 'confirmed',
  maxRetries: 3
});
```

### `client.getConnection()`

Get a standard Solana Connection instance.
```typescript
const connection = client.getConnection();
const balance = await connection.getBalance(publicKey);
```

### `client.request(method, params)`

Make a generic RPC request.
```typescript
const blockhash = await client.request('getLatestBlockhash');
```

## Custom Endpoint

Use your own YOKAI RPC instance:
```typescript
const client = new YokaiRPCClient({
  endpoint: 'https://your-instance.com/api/rpc'
});
```

## Links

- Website: [app.yokairpc.io](https://app.yokairpc.io)
- Documentation: [docs](https://app.yokairpc.io/docs.html)
- GitHub: [yokairpc/yokai-rpc](https://github.com/yokairpc/yokai-rpc)
- Twitter: [@yokairpcdotio](https://x.com/yokairpcdotio)

## License

MIT License - see [LICENSE](../../LICENSE) for details.