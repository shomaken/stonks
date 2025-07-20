import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { TOKEN_CONFIG, getAllStockTokens } from '../services/tokenService'
import { getTokenBalance } from '../utils/tokenUtils'

function WalletDashboard() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const [balances, setBalances] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchAllBalances = async () => {
    if (!publicKey || !connected) return

    setLoading(true)
    try {
      const newBalances = {}

      // Get SOL balance
      try {
        const solBalance = await connection.getBalance(publicKey)
        newBalances.SOL = {
          balance: solBalance / LAMPORTS_PER_SOL,
          symbol: 'SOL',
          name: 'Solana',
          decimals: 9
        }
      } catch (error) {
        console.error('Error fetching SOL balance:', error)
        newBalances.SOL = { balance: 0, symbol: 'SOL', name: 'Solana', decimals: 9 }
      }

      // Get STONKS balance
      try {
        const stonksBalance = await getTokenBalance(connection, publicKey.toString(), TOKEN_CONFIG.STONKS.mint)
        newBalances.STONKS = {
          balance: stonksBalance,
          symbol: 'STONKS',
          name: 'Stonks Token',
          decimals: TOKEN_CONFIG.STONKS.decimals
        }
      } catch (error) {
        console.error('Error fetching STONKS balance:', error)
        newBalances.STONKS = { balance: 0, symbol: 'STONKS', name: 'Stonks Token', decimals: 9 }
      }

      // Get all stock token balances
      const stockTokens = getAllStockTokens()
      console.log('🔍 Stock tokens from service:', stockTokens)
      console.log('🔍 Fetching balances for stock tokens:', stockTokens.map(t => `${t.symbol}: ${t.mint}`))
      
      await Promise.all(
        stockTokens.map(async (token) => {
          try {
            console.log(`🔍 Fetching balance for ${token.symbol} (${token.mint})`)
            const balance = await getTokenBalance(connection, publicKey.toString(), token.mint)
            console.log(`✅ ${token.symbol} balance:`, balance)
            newBalances[token.symbol] = {
              balance,
              symbol: token.symbol,
              name: token.name,
              decimals: 6 // Most stock tokens use 6 decimals
            }
          } catch (error) {
            console.error(`❌ Error fetching ${token.symbol} balance:`, error)
            newBalances[token.symbol] = { balance: 0, symbol: token.symbol, name: token.name, decimals: 6 }
          }
        })
      )

      console.log('📊 Final balances object:', newBalances)
      setBalances(newBalances)
    } catch (error) {
      console.error('❌ Error fetching balances:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (connected && publicKey) {
      fetchAllBalances()
    } else {
      setBalances({})
    }
  }, [connected, publicKey, connection])

  if (!connected) {
    return null
  }

  const formatBalance = (balance, decimals = 6) => {
    if (balance === 0) return '0.00'
    if (balance < 0.000001) return balance.toExponential(3)
    if (balance < 0.001) return balance.toFixed(6)
    if (balance < 1) return balance.toFixed(4)
    return balance.toFixed(2)
  }

  const balanceEntries = Object.entries(balances)
  const hasNonZeroBalances = balanceEntries.some(([, data]) => data.balance > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Wallet Balance</h3>
        <button
          onClick={fetchAllBalances}
          disabled={loading}
          className="text-stonks-green hover:text-green-400 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      ) : balanceEntries.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p>Connect your wallet to view balances</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {balanceEntries.map(([symbol, data]) => (
            <motion.div
              key={symbol}
              whileHover={{ scale: 1.02 }}
              className={`bg-gray-800/50 rounded-lg p-3 border transition-colors ${
                data.balance > 0 
                  ? 'border-gray-600 hover:border-stonks-green/50' 
                  : 'border-gray-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-sm ${
                  symbol === 'SOL' ? 'text-purple-400' :
                  symbol === 'STONKS' ? 'text-stonks-green' :
                  'text-blue-400'
                }`}>
                  {symbol}
                </span>
                {data.balance > 0 && (
                  <div className="w-2 h-2 bg-stonks-green rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="text-white font-semibold">
                {formatBalance(data.balance, data.decimals)}
                {data.balance > 0 && data.balance < 0.001 && (
                  <span className="text-xs text-yellow-400 block">Very small</span>
                )}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {data.name}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {hasNonZeroBalances && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-center text-sm text-gray-400">
            <div className="w-2 h-2 bg-stonks-green rounded-full mr-2"></div>
            Active balances • Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default WalletDashboard 
