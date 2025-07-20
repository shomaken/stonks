import React, { useMemo, useEffect } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { Toaster } from 'react-hot-toast'

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css'

// Import components
import BackgroundCanvas from './components/BackgroundCanvas'
import Hero from './components/Hero'
import Info from './components/Info'
import Dashboard from './components/Dashboard'
import Footer from './components/Footer'

// Import token service
import { checkTokenConfiguration, logTokenConfiguration } from './services/tokenService'

function App() {
  // Configure Solana network and RPC endpoint with fallbacks
  const network = WalletAdapterNetwork.Mainnet
  const endpoint = useMemo(() => {
    // Use completely free RPC endpoints (no API key required)
    const freeRpcEndpoints = [
      'https://solana-api.projectserum.com',
      'https://api.mainnet-beta.solana.com',
      'https://solana-mainnet.g.alchemy.com/v2/demo',
      'https://mainnet.helius-rpc.com/?api-key=demo'
    ]
    
    return import.meta.env.VITE_SOLANA_RPC_URL || freeRpcEndpoints[0]
  }, [network])

  // Check token configuration on app startup
  useEffect(() => {
    checkTokenConfiguration()
    
    // Log token configuration in development
    if (import.meta.env.DEV) {
      logTokenConfiguration()
    }
  }, [])

  // Configure wallet adapters
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="relative min-h-screen bg-navy">
            {/* 3D Background Canvas */}
            <BackgroundCanvas />
            
            {/* Main Content */}
            <div className="relative z-10">
              <Hero />
              <Info />
              <Dashboard />
              <Footer />
            </div>
            
            {/* Toast Notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#ffffff',
                  border: '1px solid #3FBF3F',
                },
                success: {
                  iconTheme: {
                    primary: '#3FBF3F',
                    secondary: '#ffffff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                },
              }}
            />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default App 