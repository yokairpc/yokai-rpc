import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentation | YOKAI RPC',
  description: 'Complete guide to YOKAI RPC - Privacy-First RPC Infrastructure on Solana',
}

export default function DocsPage() {
  return (
    <div className="w-full h-screen">
      <iframe 
        src="/docs.html" 
        className="w-full h-full border-0"
        title="YOKAI RPC Documentation"
      />
    </div>
  )
}