# YOKAI RPC

[![npm client version](https://img.shields.io/npm/v/@yokairpc/client?label=@yokairpc/client&color=E91E63)](https://www.npmjs.com/package/@yokairpc/client)
[![npm sdk version](https://img.shields.io/npm/v/@yokairpc/sdk?label=@yokairpc/sdk&color=9C27B0)](https://www.npmjs.com/package/@yokairpc/sdk)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yokairpc/yokai-rpc/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yokairpc/yokai-rpc?style=social)](https://github.com/yokairpc/yokai-rpc)

Privacy-first DeFi infrastructure on Solana with built-in MEV protection.

## 🚀 Quick Start

### NPM Packages (Recommended)

Install YOKAI RPC in your project:
```bash
# Lightweight RPC Client
npm install @yokairpc/client

# Full SDK with Jupiter Integration
npm install @yokairpc/sdk
```

**Simple RPC Client:**
```typescript
import { YokaiRPCClient } from '@yokairpc/client';

const client = new YokaiRPCClient();
const connection = client.getConnection();
const balance = await connection.getBalance(publicKey);
```

**Full SDK (One-Line Swaps):**
```typescript
import { YokaiSDK } from '@yokairpc/sdk';

const sdk = new YokaiSDK();
const result = await sdk.swap({
  inputToken: 'SOL',
  outputToken: 'USDC',
  amount: 1.5,
  wallet: myWallet
});
```

---

## 📦 NPM Packages

| Package | Description | Size | NPM |
|---------|-------------|------|-----|
| [@yokairpc/client](https://www.npmjs.com/package/@yokairpc/client) | Lightweight RPC client | ~3KB | [![npm](https://img.shields.io/npm/v/@yokairpc/client.svg)](https://www.npmjs.com/package/@yokairpc/client) |
| [@yokairpc/sdk](https://www.npmjs.com/package/@yokairpc/sdk) | Full SDK with Jupiter | ~10KB | [![npm](https://img.shields.io/npm/v/@yokairpc/sdk.svg)](https://www.npmjs.com/package/@yokairpc/sdk) |

**Documentation:**
- [Client API Docs](./packages/client/README.md)
- [SDK API Docs](./packages/sdk/README.md)

---

## 🎯 What is YOKAI?

YOKAI is a complete privacy-first DeFi infrastructure on Solana consisting of:

1. **YOKAI RPC** - Privacy-protected RPC endpoint with MEV protection
2. **NPM Packages** - Easy integration libraries for developers
3. **YOKAI DEX** - Reference implementation and live demo

This repository contains the complete source code for all components.

---

## 🛡️ YOKAI RPC

Privacy-first RPC infrastructure with built-in MEV protection.

### Features

- ✅ **MEV Protection** - Prevents sandwich attacks and frontrunning
- ✅ **Sub-100ms Latency** - Institutional-grade performance
- ✅ **99.9% Uptime** - Enterprise reliability
- ✅ **Free Forever** - Unlimited requests, no API key required

### Direct RPC Access

Use YOKAI RPC without installing packages:
```javascript
import { Connection } from '@solana/web3.js';

const connection = new Connection(
  'https://app.yokairpc.io/api/rpc',
  'confirmed'
);
```

### Supported Methods

All standard Solana JSON-RPC methods:
- `sendTransaction`, `simulateTransaction`
- `getAccountInfo`, `getBalance`, `getTokenAccountBalance`
- `getBlock`, `getLatestBlockhash`, `getSlot`
- And more...

---

## 💱 YOKAI DEX

Live demo of YOKAI RPC integration. A production-ready Solana DEX featuring:

- Jupiter aggregator integration
- Privacy-protected swaps
- Slippage protection
- Modern, responsive UI

**Try it live:** [app.yokairpc.io](https://app.yokairpc.io)

---

## 👨‍💻 For Developers

### Option 1: Use NPM Packages (Easiest)

Install and integrate in minutes:
```bash
npm install @yokairpc/sdk
```
```typescript
import { YokaiSDK } from '@yokairpc/sdk';

const sdk = new YokaiSDK();

// Execute MEV-protected swap
await sdk.swap({
  inputToken: 'SOL',
  outputToken: 'USDC',
  amount: 1.5,
  wallet: myWallet
});
```

**Perfect for:** Quick integration, production apps, minimal setup

---

### Option 2: Use RPC Directly

No installation needed. Just point to our endpoint:
```javascript
const connection = new Connection('https://app.yokairpc.io/api/rpc');
```

**Perfect for:** Existing apps, minimal changes, testing

---

### Option 3: Clone & Customize DEX

Fork this repository to build your own branded Solana DEX:
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

**Perfect for:** Building custom DEX, learning, full control

---

## 📚 What You Get

### NPM Packages Include:

- ✅ MEV-protected transaction sending
- ✅ Jupiter swap integration
- ✅ Token utilities and helpers
- ✅ TypeScript support
- ✅ Comprehensive documentation
- ✅ Professional error handling

### Cloning This Repo Gives You:

- ✅ Complete DEX source code
- ✅ YOKAI RPC integration examples
- ✅ Jupiter swap aggregation
- ✅ Wallet adapter integration
- ✅ Token selector with search
- ✅ Slippage controls
- ✅ Transaction history
- ✅ Responsive design

Perfect starting point for building your own Solana trading platform.

---

## 🏗️ Repository Structure
```
yokai-rpc/
├── packages/
│   ├── client/          # @yokairpc/client - RPC client package
│   └── sdk/             # @yokairpc/sdk - Full SDK package
├── app/                 # Next.js app (DEX frontend)
├── src/                 # React components and utilities
└── public/              # Static assets
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Swap Integration**: Jupiter Aggregator
- **Package Manager**: NPM Workspaces
- **Deployment**: Vercel

---

## 📖 Documentation

- **RPC Docs**: [app.yokairpc.io/docs.html](https://app.yokairpc.io/docs.html)
- **Client Package**: [packages/client/README.md](./packages/client/README.md)
- **SDK Package**: [packages/sdk/README.md](./packages/sdk/README.md)
- **Live Website**: [app.yokairpc.io](https://app.yokairpc.io)

---

## 🔒 Security

- End-to-end transaction encryption
- No logging of sensitive data
- Open source and auditable
- Privacy-first architecture
- MEV protection on all transactions

---

## 💡 Use Cases

### As NPM Package
Install `@yokairpc/sdk` for one-line MEV-protected swaps in your dApp.

### As RPC Provider
Integrate YOKAI RPC endpoint for instant MEV protection without code changes.

### As DEX Template
Fork this repository to launch your own branded Solana DEX in minutes.

### As Reference Implementation
Study production-grade Solana development: Jupiter integration, transaction handling, and DeFi UI patterns.

---

## 💎 Pricing

**Free. Forever. Unlimited.**

- ✅ RPC access: Free
- ✅ NPM packages: Free
- ✅ Source code: MIT License
- ✅ No API keys required
- ✅ No rate limits

---

## 🤝 Contributing

Contributions welcome! Please feel free to:

- Open issues for bugs or feature requests
- Submit pull requests
- Improve documentation
- Share feedback

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Website**: [app.yokairpc.io](https://app.yokairpc.io)
- **Documentation**: [app.yokairpc.io/docs.html](https://app.yokairpc.io/docs.html)
- **NPM Client**: [@yokairpc/client](https://www.npmjs.com/package/@yokairpc/client)
- **NPM SDK**: [@yokairpc/sdk](https://www.npmjs.com/package/@yokairpc/sdk)
- **GitHub**: [yokairpc/yokai-rpc](https://github.com/yokairpc/yokai-rpc)
- **Twitter**: [@yokairpcdotio](https://x.com/yokairpcdotio)
- **Token**: [$YOKAI on Solscan](https://solscan.io/token/9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump)

---

**Privacy for Solana. Privacy for everyone.**