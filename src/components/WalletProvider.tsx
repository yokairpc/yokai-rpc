// src/components/WalletProvider.tsx
'use client'

import { FC, ReactNode, useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter, } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: ReactNode
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet
  
  const endpoint = useMemo(() => {
    const yokaiRpc = process.env.NEXT_PUBLIC_RPC_ENDPOINT

    if (yokaiRpc) {
      if (yokaiRpc.startsWith('/')) {
        if (typeof window !== 'undefined') {
          const fullUrl = `${window.location.origin}${yokaiRpc}`
          console.log('✅ Using Yokai RPC:', fullUrl)
          return fullUrl
        }
        return `http://localhost:3000${yokaiRpc}`
      }
      
      console.log('✅ Using Yokai RPC:', yokaiRpc)
      return yokaiRpc
    }

    console.log('⚠️ Using public RPC (fallback)')
    return clusterApiUrl(network)
  }, [network])
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  )
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}