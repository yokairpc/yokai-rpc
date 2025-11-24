// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletContextProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YOKAI RPC | Kawaii Fox Spirit DEX',
  description: 'Trade with fox magic! MEV-protected swaps on Solana. Cute but clever. Protected by kawaii kitsune spirit.',
  keywords: ['Solana', 'DEX', 'MEV Protection', 'Jupiter', 'Swap', 'Yokai', 'Kitsune'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'YOKAI RPC - Kawaii Fox Spirit DEX',
    description: 'Cute but clever. Trade with MEV protection on Solana.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YOKAI RPC - Kawaii Fox Spirit DEX',
    description: 'Trade with fox magic! MEV-protected swaps.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>
          {/* Decorative Background Elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Sakura Petals - Reduced count */}
            <div className="absolute top-10 left-10 text-5xl opacity-8 animate-float">
              🌸
            </div>
            <div className="absolute top-20 right-20 text-5xl opacity-8 animate-float" style={{animationDelay: '1s'}}>
              🌸
            </div>
            <div className="absolute bottom-20 left-1/4 text-4xl opacity-8 animate-float" style={{animationDelay: '2s'}}>
              🌸
            </div>
            <div className="absolute bottom-32 right-1/3 text-4xl opacity-8 animate-float" style={{animationDelay: '2.5s'}}>
              🌸
            </div>
            
            {/* Sparkles - Reduced count */}
            <div className="absolute top-40 left-1/3 text-xl opacity-15 animate-sparkle">
              ✨
            </div>
            <div className="absolute top-60 right-1/4 text-xl opacity-15 animate-sparkle" style={{animationDelay: '1s'}}>
              ✨
            </div>
            <div className="absolute bottom-40 left-40 text-xl opacity-15 animate-sparkle" style={{animationDelay: '0.5s'}}>
              ✨
            </div>
            <div className="absolute bottom-60 right-60 text-xl opacity-15 animate-sparkle" style={{animationDelay: '2s'}}>
              ✨
            </div>
            
            {/* Gradient Orbs - Subtle */}
            <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-pink-200/10 to-purple-200/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-gradient-to-br from-cyan-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-10">
            {children}
          </div>
        </WalletContextProvider>
      </body>
    </html>
  )
}
