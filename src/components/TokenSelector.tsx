// src/components/TokenSelector.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, X, TrendingUp } from 'lucide-react'
import { JupiterToken, getJupiterTokenList, searchTokens, POPULAR_TOKENS } from '@/lib/jupiter-client'

interface TokenSelectorProps {
  selectedToken: JupiterToken | null
  onSelectToken: (token: JupiterToken) => void
  onClose: () => void
  excludeToken?: string
}

export default function TokenSelector({ 
  selectedToken, 
  onSelectToken, 
  onClose,
  excludeToken 
}: TokenSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tokens, setTokens] = useState<JupiterToken[]>([])
  const [filteredTokens, setFilteredTokens] = useState<JupiterToken[]>([])
  const [popularTokens, setPopularTokens] = useState<JupiterToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function loadTokens() {
      setIsLoading(true)
      const allTokens = await getJupiterTokenList()
      
      const filtered = excludeToken 
        ? allTokens.filter(t => t.address !== excludeToken)
        : allTokens
      
      setTokens(filtered)
      setFilteredTokens(filtered.slice(0, 50))
      
      const popular = POPULAR_TOKENS
        .map(addr => filtered.find(t => t.address === addr))
        .filter(t => t !== undefined) as JupiterToken[]
      
      setPopularTokens(popular)
      setIsLoading(false)
    }
    
    loadTokens()
  }, [excludeToken])
  
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTokens(tokens.slice(0, 50))
      return
    }
    
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await searchTokens(searchQuery)
        setFilteredTokens(results)
      } catch (error) {
        console.error('Search error:', error)
        const lowerQuery = searchQuery.toLowerCase()
        const localResults = tokens.filter(token => 
          token.symbol.toLowerCase().includes(lowerQuery) ||
          token.name.toLowerCase().includes(lowerQuery) ||
          token.address.toLowerCase().includes(lowerQuery)
        ).slice(0, 50)
        setFilteredTokens(localResults)
      } finally {
        setIsLoading(false)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [searchQuery, tokens])
  
  function handleSelectToken(token: JupiterToken) {
    onSelectToken(token)
    onClose()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl border-2 border-[#FFB4D6]/30 w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b-2 border-[#FFB4D6]/20 flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#2D1B4E] flex items-center gap-2">
            🪙 Select Token
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFF0F7] rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-[#6B4E8F]" />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-4 border-b-2 border-[#FFB4D6]/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A899B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, symbol, or address..."
              className="w-full pl-10 pr-4 py-3 bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] border-2 border-[#FFB4D6]/30 rounded-2xl text-[#2D1B4E] placeholder-[#A899B8] focus:outline-none focus:border-[#FFB4D6] transition-colors"
              autoFocus
            />
          </div>
        </div>
        
        {/* Token List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center text-[#A899B8] py-8">
              <svg className="animate-spin w-8 h-8">
              </svg>
              <p className="text-sm">Loading tokens...</p>
            </div>
          ) : (
            <>
              {/* Popular Tokens */}
              {!searchQuery && popularTokens.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-[#6B4E8F] mb-3 font-semibold">
                    <TrendingUp className="w-4 h-4 text-[#FF9D76]" />
                    <span>Popular</span>
                  </div>
                  <div className="space-y-2">
                    {popularTokens.map((token) => (
                      <TokenItem
                        key={token.address}
                        token={token}
                        isSelected={selectedToken?.address === token.address}
                        onSelect={handleSelectToken}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* All Tokens */}
              <div>
                {!searchQuery && (
                  <div className="text-sm text-[#6B4E8F] mb-3 font-semibold">
                    All Tokens
                  </div>
                )}
                <div className="space-y-2">
                  {filteredTokens.length > 0 ? (
                    filteredTokens.map((token) => (
                      <TokenItem
                        key={token.address}
                        token={token}
                        isSelected={selectedToken?.address === token.address}
                        onSelect={handleSelectToken}
                      />
                    ))
                  ) : (
                    <div className="text-center text-[#A899B8] py-8">
                      <div className="text-4xl mb-2">🔍</div>
                      <p className="text-sm">No tokens found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function TokenItem({ 
  token, 
  isSelected, 
  onSelect 
}: { 
  token: JupiterToken
  isSelected: boolean
  onSelect: (token: JupiterToken) => void
}) {
  return (
    <button
      onClick={() => onSelect(token)}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
        isSelected
          ? 'bg-gradient-to-r from-[#FFB4D6]/20 to-[#C9A0FF]/20 border-2 border-[#FFB4D6] shadow-md'
          : 'bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] border-2 border-transparent hover:border-[#FFB4D6]/30 hover:shadow-sm'
      }`}
    >
      {/* Token Logo */}
      {token.logoURI ? (
        <img
          src={token.logoURI}
          alt={token.symbol}
          className="w-10 h-10 rounded-full border-2 border-[#FFB4D6]/30"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
            e.currentTarget.nextElementSibling?.classList.remove('hidden')
          }}
        />
      ) : null}
      <div 
        className={`w-10 h-10 rounded-full bg-gradient-to-br from-[#FFB4D6] to-[#C9A0FF] flex items-center justify-center text-white font-bold text-sm border-2 border-[#FFB4D6]/30 ${
          token.logoURI ? 'hidden' : ''
        }`}
      >
        {token.symbol.substring(0, 2)}
      </div>
      
      {/* Token Info */}
      <div className="flex-1 text-left">
        <div className="font-semibold text-[#2D1B4E]">{token.symbol}</div>
        <div className="text-xs text-[#6B4E8F] truncate">{token.name}</div>
      </div>
      
      {/* Selected Badge */}
      {isSelected && (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] rounded-full animate-pulse" />
        </div>
      )}
    </button>
  )
}
