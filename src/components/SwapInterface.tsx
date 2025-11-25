// src/components/SwapInterface.tsx
'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Transaction, TransactionInstruction, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddressSync } from '@solana/spl-token'
import { JupiterClient, QuoteResponse, JupiterToken, getTokenByAddress, TOKENS } from '@/lib/jupiter-client'
import { YokaiRPCClient } from '@/lib/yokai-rpc-client'
import TokenSelector from './TokenSelector'
import { ArrowDownUp, Settings, Loader2, CheckCircle2, XCircle, Wallet, Sparkles } from 'lucide-react'

export default function SwapInterface() {
  const wallet = useWallet()
  const { connection } = useConnection()
  
  const [inputToken, setInputToken] = useState<JupiterToken | null>(null)
  const [outputToken, setOutputToken] = useState<JupiterToken | null>(null)
  const [inputAmount, setInputAmount] = useState('')
  const [slippage, setSlippage] = useState(0.5)
  const [showSettings, setShowSettings] = useState(false)
  const [showInputSelector, setShowInputSelector] = useState(false)
  const [showOutputSelector, setShowOutputSelector] = useState(false)
  
  const [quote, setQuote] = useState<QuoteResponse | null>(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  
  const [inputBalance, setInputBalance] = useState<number | null>(null)
  const [outputBalance, setOutputBalance] = useState<number | null>(null)
  const [isLoadingBalances, setIsLoadingBalances] = useState(false)
  
  const [result, setResult] = useState<{
    success: boolean
    message: string
    signature?: string
  } | null>(null)
  
  useEffect(() => {
    async function loadDefaultTokens() {
      const sol = await getTokenByAddress(TOKENS.SOL)
      const usdc = await getTokenByAddress(TOKENS.USDC)
      
      if (sol) setInputToken(sol)
      if (usdc) setOutputToken(usdc)
    }
    
    loadDefaultTokens()
  }, [])
  
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      fetchBalances()
    } else {
      setInputBalance(null)
      setOutputBalance(null)
    }
  }, [wallet.connected, wallet.publicKey, inputToken, outputToken])
  
  async function fetchBalances() {
    if (!wallet.publicKey) return
    
    setIsLoadingBalances(true)
    
    try {
      if (inputToken) {
        const balance = await getTokenBalance(inputToken)
        setInputBalance(balance)
      }
      
      if (outputToken) {
        const balance = await getTokenBalance(outputToken)
        setOutputBalance(balance)
      }
    } catch (error) {
      console.error('Error fetching balances:', error)
    } finally {
      setIsLoadingBalances(false)
    }
  }
  
  async function getTokenBalance(token: JupiterToken): Promise<number> {
  if (!wallet.publicKey) return 0
  
  try {
    if (token.address === TOKENS.SOL) {
      const balance = await connection.getBalance(wallet.publicKey)
      return balance / 1e9
    }
    
    const tokenMint = new PublicKey(token.address)
    const tokenAccount = getAssociatedTokenAddressSync(
      tokenMint,
      wallet.publicKey
    )
    
    const accountInfo = await connection.getAccountInfo(tokenAccount)
    
    if (!accountInfo) {
      return 0
    }
    
    const balance = await connection.getTokenAccountBalance(tokenAccount)
    
    // Use RPC's uiAmount if available, otherwise calculate
    return balance.value.uiAmount !== null 
      ? balance.value.uiAmount 
      : parseFloat(balance.value.amount) / Math.pow(10, token.decimals)
    
  } catch (error) {
    console.error('Error fetching token balance:', error)
    return 0
  }
}
  
  function handleSetMaxInput() {
    if (inputBalance === null) return
    
    if (inputToken?.address === TOKENS.SOL) {
      const maxAmount = Math.max(0, inputBalance - 0.01)
      setInputAmount(maxAmount.toFixed(6))
    } else {
      setInputAmount(inputBalance.toFixed(6))
    }
    
    setQuote(null)
  }
  
  function handleFlipTokens() {
    const temp = inputToken
    setInputToken(outputToken)
    setOutputToken(temp)
    
    const tempBalance = inputBalance
    setInputBalance(outputBalance)
    setOutputBalance(tempBalance)
    
    setQuote(null)
  }
  
  async function handleGetQuote() {
    if (!inputAmount || parseFloat(inputAmount) <= 0) {
      alert('Please enter an amount')
      return
    }
    
    if (!inputToken || !outputToken) {
      alert('Please select tokens')
      return
    }
    
    setIsLoadingQuote(true)
    setQuote(null)
    setResult(null)
    
    try {
      const amountLamports = JupiterClient.toLamports(
        parseFloat(inputAmount),
        inputToken.decimals
      )
      
      const jupiterClient = new JupiterClient()
      const quoteResponse = await jupiterClient.getQuote(
        inputToken.address,
        outputToken.address,
        amountLamports,
        slippage * 100
      )
      
      setQuote(quoteResponse)
      
    } catch (error) {
      console.error('Quote error:', error)
      alert('Failed to get quote: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsLoadingQuote(false)
    }
  }
  
  async function handleSwap() {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect wallet')
      return
    }
    
    if (!quote || !inputToken || !outputToken) {
      alert('Please get a quote first')
      return
    }
    
    setIsSwapping(true)
    setResult(null)
    
    try {
      console.log('🔐 Executing MEV-protected swap via YOKAI RPC...')
      
      const jupiterClient = new JupiterClient()
      const swapInstructions = await jupiterClient.getSwapInstructions(
        quote,
        wallet.publicKey.toBase58()
      )
      
      console.log('📝 Building transaction...')
      
      const deserializeInstruction = (instruction: any) => {
        return new TransactionInstruction({
          programId: new PublicKey(instruction.programId),
          keys: instruction.accounts.map((key: any) => ({
            pubkey: new PublicKey(key.pubkey),
            isSigner: key.isSigner,
            isWritable: key.isWritable,
          })),
          data: Buffer.from(instruction.data, 'base64'),
        })
      }
      
      const instructions: TransactionInstruction[] = []
      
      if (swapInstructions.computeBudgetInstructions) {
        swapInstructions.computeBudgetInstructions.forEach((ix: any) => {
          instructions.push(deserializeInstruction(ix))
        })
      }
      
      if (swapInstructions.setupInstructions) {
        swapInstructions.setupInstructions.forEach((ix: any) => {
          instructions.push(deserializeInstruction(ix))
        })
      }
      
      instructions.push(deserializeInstruction(swapInstructions.swapInstruction))
      
      if (swapInstructions.cleanupInstruction) {
        instructions.push(deserializeInstruction(swapInstructions.cleanupInstruction))
      }
      
      const swapTransaction = new Transaction()
      swapTransaction.add(...instructions)
      
      console.log('🚀 Sending via YOKAI MEV-Protected RPC...')
      
      const yokaiClient = new YokaiRPCClient()
      const txResult = await yokaiClient.sendProtectedTransaction(
        swapTransaction,
        wallet,
        connection
      )
      
      if (txResult.success && txResult.signature) {
        console.log('✅ Transaction sent:', txResult.signature)
        
        // ✅ CRITICAL FIX: Wait for confirmation BEFORE refreshing balance
        console.log('⏳ Waiting for transaction confirmation...')
        
        try {
          const confirmation = await connection.confirmTransaction(
            txResult.signature,
            'confirmed'
          )
          
          if (confirmation.value.err) {
            throw new Error('Transaction failed: ' + JSON.stringify(confirmation.value.err))
          }
          
          console.log('✅ Transaction confirmed!')
          
          // ✅ CRITICAL FIX: Refresh balances AFTER confirmation
          console.log('🔄 Refreshing balances...')
          await fetchBalances()
          console.log('✅ Balances updated!')
          
          setResult({
            success: true,
            message: 'Swap executed successfully with MEV protection!',
            signature: txResult.signature
          })
          
          setInputAmount('')
          setQuote(null)
          
        } catch (confirmError) {
          console.error('⚠️ Confirmation error:', confirmError)
          
          // Transaction was sent but confirmation failed/timeout
          setResult({
            success: true,
            message: 'Transaction sent but confirmation pending. Check Solscan for status.',
            signature: txResult.signature
          })
          
          setInputAmount('')
          setQuote(null)
          
          // Still try to refresh balances after a delay as fallback
          setTimeout(() => fetchBalances(), 5000)
        }
        
      } else {
        setResult({
          success: false,
          message: txResult.error || 'Swap failed'
        })
      }
      
    } catch (error) {
      console.error('❌ Swap error:', error)
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsSwapping(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto relative">
      {/* Card with Kawaii styling */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#FFB4D6]/30 relative overflow-hidden">
        {/* Decorative sparkle */}
        <div className="absolute top-4 right-4 text-2xl opacity-30 animate-sparkle">✨</div>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#2D1B4E] flex items-center gap-2">
              Yokai Swap
            </h2>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 hover:bg-[#FFF0F7] rounded-2xl transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-[#6B4E8F]" />
          </button>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-2xl border border-[#FFB4D6]/30">
            <label className="block text-sm text-[#6B4E8F] font-medium mb-3">
              Slippage Tolerance
            </label>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    slippage === value
                      ? 'bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] text-[#2D1B4E] shadow-lg'
                      : 'bg-white text-[#6B4E8F] hover:bg-[#FFF0F7]'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                className="w-20 px-3 py-2 bg-white border-2 border-[#FFB4D6]/30 rounded-xl text-[#2D1B4E] focus:border-[#FFB4D6] focus:outline-none transition-colors"
                step="0.1"
                min="0.1"
                max="50"
              />
            </div>
          </div>
        )}
        
        {/* Input Token */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-[#6B4E8F] font-medium">You pay</label>
            {wallet.connected && (
              <div className="flex items-center gap-2 text-xs text-[#A899B8]">
                <Wallet className="w-3 h-3" />
                <span>
                  {isLoadingBalances ? (
                    'Loading...'
                  ) : inputBalance !== null ? (
                    <>
                      {inputBalance.toFixed(4)} {inputToken?.symbol}
                      <button
                        onClick={handleSetMaxInput}
                        className="ml-2 px-2 py-0.5 bg-gradient-to-r from-[#7DD3FC] to-[#C9A0FF] text-white rounded-lg text-xs font-medium hover:shadow-lg transition-all duration-300"
                      >
                        MAX
                      </button>
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-2xl p-4 border-2 border-[#FFB4D6]/20 focus-within:border-[#FFB4D6] transition-colors">
            <div className="flex justify-between items-center gap-3">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => {
                  setInputAmount(e.target.value)
                  setQuote(null)
                }}
                placeholder="0.0"
                className="bg-transparent text-3xl text-[#2D1B4E] font-semibold outline-none w-full placeholder-[#A899B8]"
              />
              <button
                onClick={() => setShowInputSelector(true)}
                className="bg-white px-3 py-2 rounded-xl hover:bg-[#FFF0F7] transition-all duration-300 flex items-center gap-2 shadow-sm border border-[#FFB4D6]/30 flex-shrink-0 min-w-0"
              >
                {inputToken?.logoURI && (
                  <img src={inputToken.logoURI} alt={inputToken.symbol} className="w-6 h-6 rounded-full flex-shrink-0" />
                )}
                <span className="text-[#2D1B4E] font-semibold truncate max-w-[70px]">{inputToken?.symbol || 'Select'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Flip Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={handleFlipTokens}
            className="p-3 bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] hover:from-[#FF9D76] hover:to-[#FFB4D6] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ArrowDownUp className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Output Token */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-[#6B4E8F] font-medium">You receive</label>
            {wallet.connected && (
              <div className="flex items-center gap-2 text-xs text-[#A899B8]">
                <Wallet className="w-3 h-3" />
                <span>
                  {isLoadingBalances ? (
                    'Loading...'
                  ) : outputBalance !== null ? (
                    `${outputBalance.toFixed(4)} ${outputToken?.symbol}`
                  ) : (
                    '-'
                  )}
                </span>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] rounded-2xl p-4 border-2 border-[#FFB4D6]/20">
            <div className="flex justify-between items-center gap-3">
              <div className="text-3xl text-[#2D1B4E] font-semibold">
                {quote && outputToken
                  ? JupiterClient.formatAmount(quote.outAmount, outputToken.decimals).toFixed(6)
                  : '0.0'
                }
              </div>
              <button
                onClick={() => setShowOutputSelector(true)}
                className="bg-white px-3 py-2 rounded-xl hover:bg-[#FFF0F7] transition-all duration-300 flex items-center gap-2 shadow-sm border border-[#FFB4D6]/30 flex-shrink-0 min-w-0"
              >
                {outputToken?.logoURI && (
                  <img src={outputToken.logoURI} alt={outputToken.symbol} className="w-6 h-6 rounded-full flex-shrink-0" />
                )}
                <span className="text-[#2D1B4E] font-semibold truncate max-w-[70px]">{outputToken?.symbol || 'Select'}</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Quote Info */}
        {quote && (
          <div className="mb-4 p-4 bg-gradient-to-r from-[#7DD3FC]/10 to-[#C9A0FF]/10 rounded-2xl border border-[#7DD3FC]/30">
            <div className="text-sm space-y-2">
              <div className="flex justify-between text-[#6B4E8F]">
                <span>Price Impact:</span>
                <span className={`font-semibold ${
                  parseFloat(quote.priceImpactPct) > 1 ? 'text-[#FF9898]' : 'text-[#7FD99E]'
                }`}>
                  {quote.priceImpactPct}%
                </span>
              </div>
              <div className="flex justify-between text-[#6B4E8F]">
                <span>Route:</span>
                <span className="font-semibold text-[#7DD3FC]">
                  {quote.routePlan[0]?.swapInfo.label || 'Direct'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          {!quote ? (
            <button
              onClick={handleGetQuote}
              disabled={!wallet.connected || isLoadingQuote || !inputAmount || !inputToken || !outputToken}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                !wallet.connected || !inputAmount || !inputToken || !outputToken
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isLoadingQuote
                  ? 'bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] text-white opacity-70'
                  : 'bg-gradient-to-r from-[#7DD3FC] to-[#C9A0FF] text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isLoadingQuote ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting Quote...
                </span>
              ) : !wallet.connected ? (
                'Connect Wallet'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Get Quote
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={isSwapping}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isSwapping
                  ? 'bg-gradient-to-r from-[#FF9D76] to-[#FFB4D6] text-white opacity-70'
                  : 'bg-gradient-to-r from-[#FF9D76] to-[#FFB4D6] text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {isSwapping ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Swapping...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Execute Swap
                </span>
              )}
            </button>
          )}
          
          {quote && (
            <button
              onClick={() => setQuote(null)}
              className="w-full py-2 text-[#6B4E8F] hover:text-[#2D1B4E] transition-colors text-sm font-medium"
            >
              Get New Quote
            </button>
          )}
        </div>
        
        {/* Result */}
        {result && (
          <div className={`mt-4 p-4 rounded-2xl border-2 ${
            result.success 
              ? 'bg-[#7FD99E]/10 border-[#7FD99E]' 
              : 'bg-[#FF9898]/10 border-[#FF9898]'
          }`}>
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-[#7FD99E] flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-[#FF9898] flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${
                  result.success ? 'text-[#2D1B4E]' : 'text-[#FF9898]'
                }`}>
                  {result.message}
                </p>
                {result.signature && (
                  <a 
                    href={`https://solscan.io/tx/${result.signature}`}
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
        
        {/* Footer tagline */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#A899B8] italic">
            Secured by YOKAI's privacy infrastructure
          </p>
        </div>
      </div>
      
      {/* Token Selectors */}
      {showInputSelector && (
        <TokenSelector
          selectedToken={inputToken}
          onSelectToken={(token) => {
            setInputToken(token)
            setQuote(null)
            setShowInputSelector(false)
          }}
          onClose={() => setShowInputSelector(false)}
          excludeToken={outputToken?.address}
        />
      )}
      
      {showOutputSelector && (
        <TokenSelector
          selectedToken={outputToken}
          onSelectToken={(token) => {
            setOutputToken(token)
            setQuote(null)
            setShowOutputSelector(false)
          }}
          onClose={() => setShowOutputSelector(false)}
          excludeToken={inputToken?.address}
        />
      )}
    </div>
  )
}