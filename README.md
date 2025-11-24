# YOKAI

Privacy-first DeFi infrastructure on Solana.

## What is YOKAI?

YOKAI consists of two components:

1. **YOKAI RPC** - Privacy-protected RPC endpoint for Solana
2. **YOKAI DEX** - Reference implementation showing RPC in action

This repository contains the complete source code for both.

## YOKAI RPC

Privacy-first RPC infrastructure with built-in MEV protection.

### Features

- **MEV Protection**: Prevents sandwich attacks and frontrunning
- **Sub-100ms Latency**: Institutional-grade performance
- **99.9% Uptime**: Enterprise reliability
- **Free Forever**: Unlimited requests, no API key required

### Quick Integration

Use YOKAI RPC in your Solana dApp:
```javascript
import { Connection } from '@solana/web3.js';

const connection = new Connection(
  'https://app.yokairpc.io/api/rpc',
  'confirmed'
);
```

No cloning needed. Just change your RPC endpoint.

### Supported Methods

All standard Solana JSON-RPC methods supported:
- `sendTransaction`, `simulateTransaction`
- `getAccountInfo`, `getBalance`, `getTokenAccountBalance`
- `getBlock`, `getLatestBlockhash`, `getSlot`
- And more...

## YOKAI DEX

Live demo of YOKAI RPC integration. A production-ready Solana DEX with:

- Jupiter aggregator integration
- Privacy-protected swaps
- Slippage protection
- Modern, responsive UI

**Try it:** [app.yokairpc.io](https://app.yokairpc.io)

## For Developers

### Option 1: Use YOKAI RPC Only

No setup needed. Just point your dApp to our RPC:
```javascript
const connection = new Connection('https://app.yokairpc.io/api/rpc');
```

### Option 2: Clone & Customize DEX

Fork this repository to build your own Solana DEX with YOKAI RPC:
```bash
git clone https://github.com/yokairpc/yokai-rpc.git
cd yokai-rpc
npm install
```

Create `.env` file:
```bash
# Backend RPC (see .env.example)
BACKEND_RPC_ENDPOINT=https://api.mainnet-beta.solana.com

# Frontend endpoint
NEXT_PUBLIC_RPC_ENDPOINT=http://localhost:3000/api/rpc
```

Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### What You Get

Cloning this repo gives you:

- ✅ Complete DEX source code
- ✅ YOKAI RPC integration
- ✅ Jupiter swap aggregation
- ✅ Wallet adapter integration
- ✅ Token selector with search
- ✅ Slippage controls
- ✅ Transaction history
- ✅ Responsive design

Perfect starting point for building your own Solana trading platform.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Swap Integration**: Jupiter Aggregator
- **Deployment**: Vercel

## Documentation

- **RPC Docs**: [app.yokairpc.io/docs.html](https://app.yokairpc.io/docs.html)
- **Live DEX/Website**: [app.yokairpc.io](https://app.yokairpc.io)

## Security

- End-to-end transaction encryption
- No logging of sensitive data
- Open source and auditable
- Privacy-first architecture

## Use Cases

### As RPC Provider
Integrate YOKAI RPC into any Solana dApp for instant MEV protection.

### As DEX Template
Fork this repository to launch your own branded Solana DEX in minutes.

### As Reference Implementation
Study how to integrate Jupiter, handle Solana transactions, and build production DeFi UIs.

## Pricing

**Free. Forever. Unlimited.**

Both RPC access and source code are free with no restrictions.

## Contributing

Contributions welcome! Open issues or submit pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- DEX/Website: [app.yokairpc.io](https://app.yokairpc.io)
- Twitter: [@yokairpcdotio](https://x.com/yokairpcdotio)
- Token: [View on Solscan](https://solscan.io/token/9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump)

---

**Privacy for Solana.** 
```