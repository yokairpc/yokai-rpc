// src/lib/jupiter-client.ts

export interface QuoteResponse {
  inputMint: string
  inAmount: string
  outputMint: string
  outAmount: string
  otherAmountThreshold: string
  swapMode: string
  slippageBps: number
  platformFee: null | any
  priceImpactPct: string
  routePlan: Array<{
    swapInfo: {
      ammKey: string
      label: string
      inputMint: string
      outputMint: string
      inAmount: string
      outAmount: string
      feeAmount: string
      feeMint: string
    }
    percent: number
  }>
  contextSlot?: number
  timeTaken?: number
}

export interface SwapInstructionsResponse {
  tokenLedgerInstruction: any
  computeBudgetInstructions: any[]
  setupInstructions: any[]
  swapInstruction: any
  cleanupInstruction: any
  addressLookupTableAddresses: string[]
}

export interface JupiterToken {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
  logoURI?: string
  tags?: string[]
}

export const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
  WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
  YOKAI: '9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump',
}

export const POPULAR_TOKENS = [
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So', // mSOL
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', // JitoSOL
]

let tokenListCache: JupiterToken[] | null = null

export class JupiterClient {
  private baseUrl = 'https://lite-api.jup.ag/swap/v1'
  
  async getQuote(
  inputMint: string,
  outputMint: string,
  amount: number,
  slippageBps: number = 50
): Promise<QuoteResponse> {
  try {
    console.log('🔍 Getting quote from Jupiter...')
    console.log('Input:', inputMint)
    console.log('Output:', outputMint)
    console.log('Amount:', amount)
    
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amount.toString(),
      slippageBps: slippageBps.toString(),
      maxAccounts: '40',           
      onlyDirectRoutes: 'true',    
    })
    
    const response = await fetch(`${this.baseUrl}/quote?${params}`)
    
    if (!response.ok) {
      throw new Error(`Quote failed: ${response.status}`)
    }
    
    const quote = await response.json()
    
    console.log('✅ Quote received!')
    console.log('Input amount:', quote.inAmount)
    console.log('Output amount:', quote.outAmount)
    console.log('Price impact:', quote.priceImpactPct + '%')
    console.log('Route:', quote.routePlan[0]?.swapInfo.label)
    
    return quote
    
  } catch (error) {
    console.error('❌ Get quote failed:', error)
    throw error
  }
}

  async getSwapInstructions(
    quoteResponse: QuoteResponse,
    userPublicKey: string
  ): Promise<SwapInstructionsResponse> {
    try {
      console.log('📝 Getting swap instructions...')
      
      const response = await fetch(`${this.baseUrl}/swap-instructions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey,
        })
      })
      
      if (!response.ok) {
        throw new Error(`Swap instructions failed: ${response.status}`)
      }
      
      const instructions = await response.json()
      
      if (instructions.error) {
        throw new Error(instructions.error)
      }
      
      console.log('✅ Swap instructions received!')
      
      return instructions
      
    } catch (error) {
      console.error('❌ Get swap instructions failed:', error)
      throw error
    }
  }
  
  static formatAmount(lamports: string, decimals: number = 9): number {
    return parseInt(lamports) / Math.pow(10, decimals)
  }
  
  static toLamports(amount: number, decimals: number = 9): number {
    return Math.floor(amount * Math.pow(10, decimals))
  }
}


export async function getJupiterTokenList(): Promise<JupiterToken[]> {
  if (tokenListCache && tokenListCache.length > 0) {
    return tokenListCache
  }
  
  try {
    console.log('📋 Fetching Jupiter token list...')
    
    const response = await fetch('https://lite-api.jup.ag/tokens/v2/tag?query=verified')
    
    if (!response.ok) {
      throw new Error(`Failed to fetch token list: ${response.status}`)
    }
    
    const data = await response.json()
    
    const tokens: JupiterToken[] = data.map((token: any) => ({
      address: token.id,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.icon,
      chainId: 101,
      tags: token.tags || []
    }))
    
    console.log(`✅ Loaded ${tokens.length} tokens`)
    
    tokenListCache = tokens
    
    return tokens
    
  } catch (error) {
    console.error('❌ Failed to fetch token list:', error)
    
    return [
      {
        address: 'So11111111111111111111111111111111111111112',
        symbol: 'SOL',
        name: 'Wrapped SOL',
        decimals: 9,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        chainId: 101
      },
      {
        address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
        chainId: 101
      },
      {
        address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
        symbol: 'USDT',
        name: 'Tether USD',
        decimals: 6,
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png',
        chainId: 101
      },
      {
        address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        symbol: 'BONK',
        name: 'Bonk',
        decimals: 5,
        logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
        chainId: 101
      },
      {
        address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
        symbol: 'JUP',
        name: 'Jupiter',
        decimals: 6,
        logoURI: 'https://static.jup.ag/jup/icon.png',
        chainId: 101
      },
      {
        address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
        symbol: 'WIF',
        name: 'dogwifhat',
        decimals: 6,
        logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betidfwy3ajsav2vjzyum.ipfs.nftstorage.link',
        chainId: 101
      },
      {
        address: '9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump',
        symbol: 'YOKAI',
        name: 'Yokai RPC',
        decimals: 6,
        logoURI: 'https://cf-ipfs.com/ipfs/QmSMNVaSeJVYnxoHfA9z9g2pvfFfXYS1HEHKBWxBGsJ7PF',
        chainId: 101
      }
    ]
  }
}

export async function getTokenByAddress(address: string): Promise<JupiterToken | undefined> {
  const tokens = await getJupiterTokenList()
  return tokens.find(t => t.address === address)
}

export async function searchTokens(query: string): Promise<JupiterToken[]> {
  if (!query || query.trim().length === 0) {
    return []
  }
  
  try {
    console.log('🔍 Searching tokens:', query)
    
    const response = await fetch(
      `https://lite-api.jup.ag/ultra/v1/search?query=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) {
      const tokens = await getJupiterTokenList()
      const lowerQuery = query.toLowerCase()
      
      return tokens.filter(token => 
        token.symbol.toLowerCase().includes(lowerQuery) ||
        token.name.toLowerCase().includes(lowerQuery) ||
        token.address.toLowerCase().includes(lowerQuery)
      ).slice(0, 50)
    }
    
    const results = await response.json()
    
    const tokens: JupiterToken[] = results.map((token: any) => ({
      address: token.id,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      logoURI: token.icon,
      chainId: 101,
      tags: token.tags || []
    }))
    
    console.log(`✅ Found ${tokens.length} tokens`)
    
    return tokens
    
  } catch (error) {
    console.error('❌ Search failed:', error)
    
    const tokens = await getJupiterTokenList()
    const lowerQuery = query.toLowerCase()
    
    return tokens.filter(token => 
      token.symbol.toLowerCase().includes(lowerQuery) ||
      token.name.toLowerCase().includes(lowerQuery) ||
      token.address.toLowerCase().includes(lowerQuery)
    ).slice(0, 50)
  }
}