// src/app/page.tsx
'use client'

import { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import PrivateRPC from '@/components/PrivateRPC'
import SwapInterface from '@/components/SwapInterface'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'test' | 'swap'>('swap')
  
  return (
    <main className="min-h-screen">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-2 border-[#FFB4D6]/30">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          {/* Logo - Left */}
          <div className="flex items-center gap-3">
            <img src="/yokailogo.png" alt="YOKAI RPC Logo" className="h-12 w-12 object-contain" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#2D1B4E]">YOKAI RPC</h1>
                <span className="text-xs text-[#A899B8] bg-[#FFB4D6]/20 px-2 py-0.5 rounded-full">v1.1</span>
              </div>
              <p className="text-sm text-[#FF6B9D] font-medium">Privacy-First RPC Infrastructure</p>
            </div>
          </div>
          
          {/* Wallet Button - Right */}
          <WalletMultiButton className="!bg-gradient-to-r !from-[#FFB4D6] !to-[#C9A0FF] hover:!shadow-lg !transition-all !rounded-2xl" />
        </div>
      </nav>

      {/* Content - Everything Centered */}
      <div className="w-full flex flex-col items-center px-6">
        
        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center py-8">
          <h2 className="text-5xl font-bold text-[#2D1B4E] mb-3 flex items-center justify-center gap-3">
            <span>Trade with Fox Magic</span>
          </h2>
          <p className="text-lg text-[#6B4E8F] mb-2">
            Smart swaps. Protected from bots and front-runners.
          </p>
          <p className="text-sm text-[#A899B8]">
            MEV-Protected • Private Routing • Best Market Prices
          </p>
        </div>

        {/* Tabs Section */}
        <div className="w-full max-w-md py-4">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'swap'
                  ? 'bg-gradient-to-r from-[#FFB4D6] to-[#C9A0FF] text-white shadow-lg scale-[1.02]'
                  : 'bg-white text-[#6B4E8F] border-2 border-[#FFB4D6]/30 hover:border-[#FFB4D6] hover:shadow-md'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Swap
              </span>
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === 'test'
                  ? 'bg-gradient-to-r from-[#7DD3FC] to-[#C9A0FF] text-white shadow-lg scale-[1.02]'
                  : 'bg-white text-[#6B4E8F] border-2 border-[#7DD3FC]/30 hover:border-[#7DD3FC] hover:shadow-md'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Test
              </span>
            </button>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="w-full max-w-md py-4">
          {activeTab === 'swap' ? <SwapInterface /> : <PrivateRPC />}
        </div>

        {/* Features Section */}
        <div className="w-full max-w-4xl py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border-2 border-[#FFB4D6]/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FFB4D6]/20 to-[#FF9D76]/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#FF9D76]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2D1B4E] mb-2">Lightning Fast</h3>
              <p className="text-[#6B4E8F] text-sm leading-relaxed">
                Sub-second swaps with instant confirmation. No waiting!
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-[#C9A0FF]/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#C9A0FF]/20 to-[#7DD3FC]/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#C9A0FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2D1B4E] mb-2">MEV Protected</h3>
              <p className="text-[#6B4E8F] text-sm leading-relaxed">
                Fox magic shields you from sandwich attacks and frontrunning.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border-2 border-[#7DD3FC]/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#7DD3FC]/20 to-[#7FD99E]/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#7DD3FC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2D1B4E] mb-2">Zero Extra Fees</h3>
              <p className="text-[#6B4E8F] text-sm leading-relaxed">
                No markup, no hidden costs. You get the best market price, always.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="w-full max-w-4xl py-8 border-t-2 border-[#FFB4D6]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Links */}
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-[#2D1B4E] mb-3">Links</h4>
              <div className="space-y-2">
                <a 
                  href="https://x.com/yokairpcdotio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2 text-sm text-[#6B4E8F] hover:text-[#FF6B9D] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  X
                </a>
                <a 
                  href="/docs.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center md:justify-start gap-2 text-sm text-[#6B4E8F] hover:text-[#FF6B9D] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documentation
                </a>
              </div>
            </div>

            {/* Contract Address */}
            <div className="text-right md:col-span-2">
              <h4 className="text-sm font-bold text-[#2D1B4E] mb-3">$YOKAI Token Contract</h4>
              <div className="inline-flex items-center gap-2 bg-gradient-to-br from-[#FFF8F3] to-[#FFF0F7] px-4 py-2 rounded-xl border-2 border-[#FFB4D6]/30">
                <code className="text-sm text-[#6B4E8F] font-mono">
                  9mby...2pump
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump')
                    alert('Contract address copied!')
                  }}
                  className="flex-shrink-0 p-1.5 hover:bg-[#FFB4D6]/20 rounded-lg transition-colors"
                  title="Copy full address: 9mbyMNLEhNffjhXvGDijvTrne1u281pa1tE6H1v2pump"
                >
                  <svg className="w-4 h-4 text-[#FF6B9D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}