// src/lib/yokai-rpc-client.ts

import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js'

export class YokaiRPCClient {
  private rpcUrl: string

  constructor() {
    let endpoint = process.env.NEXT_PUBLIC_RPC_ENDPOINT || '/api/rpc'
    
    if (endpoint.startsWith('/')) {
      if (typeof window !== 'undefined') {
        endpoint = `${window.location.origin}${endpoint}`
      } else {
        endpoint = `http://localhost:3000${endpoint}`
      }
    }
    
    this.rpcUrl = endpoint

    if (!this.rpcUrl) {
      console.warn('⚠️ NEXT_PUBLIC_RPC_ENDPOINT not set')
    } else {
      console.log('✅ Yokai RPC initialized:', this.rpcUrl)
    }
  }
  /**
   * Send transaction with MEV protection via YOKAI RPC
   */
  async sendProtectedTransaction(
    transaction: Transaction | VersionedTransaction,
    wallet: any,
    connection: Connection
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      console.log('🔐 Preparing MEV-protected swap via Yokai...')
      
      // Get recent blockhash with 'confirmed' commitment (fresher than 'finalized')
      const { blockhash, lastValidBlockHeight } = 
        await connection.getLatestBlockhash('confirmed')
      
      console.log('📝 Recent blockhash:', blockhash)
      console.log('📝 Last valid block height:', lastValidBlockHeight)
      
      // Set blockhash
      if (transaction instanceof VersionedTransaction) {
        transaction.message.recentBlockhash = blockhash
      } else {
        transaction.recentBlockhash = blockhash
        transaction.lastValidBlockHeight = lastValidBlockHeight
        transaction.feePayer = wallet.publicKey
        
        // Jupiter already includes compute budget instructions
      }
      
      console.log('✍️ Signing transaction...')
      
      // Sign transaction
      const signedTx = await wallet.signTransaction(transaction)
      
      console.log('📦 Serializing transaction...')
      
      // Serialize
      const serialized = signedTx.serialize({
        requireAllSignatures: false,
        verifySignatures: false
      })
      
      const base64Tx = Buffer.from(serialized).toString('base64')
      
      console.log('🚀 Sending via Yokai MEV-Protected RPC...')

      const response = await fetch(this.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'sendTransaction',
          params: [
            base64Tx,
            {
              encoding: 'base64',
              skipPreflight: false, // Enable preflight for validation
              preflightCommitment: 'confirmed',
              maxRetries: 3 // Allow automatic retries
            }
          ]
        })
      })
      
      const result = await response.json()
      
      if (result.error) {
        console.error('❌ Yokai error:', result.error)
        return {
          success: false,
          error: result.error.message || 'Transaction failed'
        }
      }
      
      const signature = result.result
      
      console.log('✅ Transaction sent with MEV protection!')
      console.log('📝 Signature:', signature)
      
      // Return immediately without waiting for confirmation
      // User can check Solscan for confirmation status
      console.log('✅ Transaction submitted successfully!')
      
      return {
        success: true,
        signature
      }
      
    } catch (error) {
      console.error('❌ Transaction failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const yokaiClient = new YokaiRPCClient()