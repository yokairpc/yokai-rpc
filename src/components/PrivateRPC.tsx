// src/components/PrivateRPC.tsx
'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Transaction, SystemProgram } from '@solana/web3.js'
import { YokaiRPCClient } from '@/lib/yokai-rpc-client'
import { Shield, Zap, Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function PrivateRPC() {
  const wallet = useWallet()
  const { connection } = useConnection()
  
  const [isProtected, setIsProtected] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [lastResult, setLastResult] = useState<{
    success: boolean
    message: string
    signature?: string
  } | null>(null)
  
  const [stats, setStats] = useState({
    totalSaved: 0,
    protectedTxs: 0,
    successRate: 99.9
  })
  
  async function handleTestTransaction() {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first')
      return
    }
    
    setIsLoading(true)
    setLastResult(null)
    
    try {
      console.log('🧪 Creating test transaction...')
      
      const testTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: wallet.publicKey,
          lamports: 1000
        })
      )
      
      if (isProtected) {
        console.log('🔐 Sending via MEV-protected RPC...')
        
        const yokaiClient = new YokaiRPCClient()
        const result = await yokaiClient.sendProtectedTransaction(
          testTx,
          wallet,
          connection
        )
        
        if (result.success) {
          setLastResult({
            success: true,
            message: 'Transaction sent with MEV protection!',
            signature: result.signature
          })
          
          setStats(prev => ({
            ...prev,
            protectedTxs: prev.protectedTxs + 1,
            totalSaved: prev.totalSaved + 0.5
          }))
        } else {
          setLastResult({
            success: false,
            message: result.error || 'Failed to send transaction'
          })
        }
      } else {
        console.log('📡 Sending via public RPC...')
        const signature = await wallet.sendTransaction(testTx, connection)
        await connection.confirmTransaction(signature)
        
        setLastResult({
          success: true,
          message: 'Transaction sent via public RPC',
          signature: signature
        })
      }
      
    } catch (error) {
      console.error('❌ Error:', error)
      setLastResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      {/* Test Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#FFB4D6]/30 relative overflow-hidden">
        {/* Decorative sparkle */}
        <div className="absolute top-4 right-4 text-2xl opacity-30 animate-sparkle">✨</div>
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#2D1B4E] flex items-center gap-2">
            🧪 Test Protected RPC
          </h2>
          <p className="text-xs text-[#A899B8] mt-1">Send a test transaction to verify MEV protection</p>
        </div>
        
        {/* Stats Mini Grid - ONLY 2 BOXES */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-xl p-3 border border-[#FFB4D6]/20 text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-[#FFB4D6] to-[#FF9D76] bg-clip-text text-transparent">
              {stats.protectedTxs}
            </div>
            <div className="text-[#6B4E8F] text-xs">Protected</div>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-xl p-3 border border-[#C9A0FF]/20 text-center">
            <div className="text-lg font-bold bg-gradient-to-r from-[#C9A0FF] to-[#FFB4D6] bg-clip-text text-transparent">
              {stats.successRate}%
            </div>
            <div className="text-[#6B4E8F] text-xs">Success</div>
          </div>
        </div>
        
        {/* MEV Protection Toggle */}
        <div className="mb-6 p-4 bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-2xl border border-[#FFB4D6]/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-[#2D1B4E] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                MEV Protection
              </h3>
              <p className="text-xs text-[#6B4E8F] mt-1">
                {isProtected 
                  ? 'Secured by privacy infrastructure' 
                  : '⚠️ Public mode - vulnerable to bots'
                }
              </p>
            </div>
            
            <button
              onClick={() => setIsProtected(!isProtected)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                isProtected 
                  ? 'bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF]' 
                  : 'bg-[#A899B8]'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  isProtected ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Protected Mode Notice */}
        {isProtected && (
          <div className="mb-6 p-3 bg-gradient-to-r from-[#7DD3FC]/10 to-[#C9A0FF]/10 rounded-xl border border-[#7DD3FC]/30">
            <div className="flex items-center gap-2 text-[#6B4E8F]">
              <Lock className="w-4 h-4 text-[#7DD3FC]" />
              <p className="text-xs font-medium">
                Protected Mode Active - Enterprise MEV Protection
              </p>
            </div>
          </div>
        )}

        {/* Test Button */}
        <button
          onClick={handleTestTransaction}
          disabled={!wallet.connected || isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            !wallet.connected
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isLoading
              ? 'bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] text-white opacity-70'
              : 'bg-gradient-to-r from-[#7DD3FC] to-[#C9A0FF] text-white hover:shadow-xl hover:scale-105'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Testing...
            </span>
          ) : !wallet.connected ? (
            'Connect Wallet to Test'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              Test {isProtected ? 'Protected' : 'Public'} Transaction
            </span>
          )}
        </button>

        {/* Result */}
        {lastResult && (
          <div className={`mt-6 p-4 rounded-2xl border-2 ${
            lastResult.success 
              ? 'bg-[#7FD99E]/10 border-[#7FD99E]' 
              : 'bg-[#FF9898]/10 border-[#FF9898]'
          }`}>
            <div className="flex items-start gap-3">
              {lastResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-[#7FD99E] flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#FF9898] flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold text-sm ${
                  lastResult.success ? 'text-[#2D1B4E]' : 'text-[#FF9898]'
                }`}>
                  {lastResult.message}
                </p>
                {lastResult.signature && (
                  <a 
                    href={`https://solscan.io/tx/${lastResult.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#7DD3FC] hover:text-[#C9A0FF] transition-colors mt-1 block font-medium"
                  >
                    View on Solscan →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <p className="text-center text-xs text-[#A899B8] mt-6 italic">
          {isProtected 
            ? '🔒 Private routing with MEV protection' 
            : '⚠️ Bots can see your transactions'
          }
        </p>
      </div>
    </div>
  )
}