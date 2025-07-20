import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import StockCard from './StockCard'
import { fetchAllStockPrices, fetchStonksPrice, formatPrice, formatPriceChange } from '../services/stockPriceService'
import { getAllStockTokens, TOKEN_CONFIG } from '../services/tokenService'

function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [stocks, setStocks] = useState([])
  const [stonksPrice, setStonksPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Load initial stock data
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true)
        const [stockData, stonksData] = await Promise.all([
          fetchAllStockPrices(),
          fetchStonksPrice()
        ])
        
        // Stock data now comes with mint addresses included
        setStocks(stockData)
        setStonksPrice(stonksData)
        setLastUpdated(new Date())
        
        // Show success toast for loaded tokens
        toast.success(`🚀 Loaded ${stockData.length} stock tokens + $STONKS with real-time prices!`)
        
        // Show warning if STONKS token not configured
        if (!TOKEN_CONFIG.STONKS.mint) {
          toast.error('⚠️ STONKS token not configured. Trading will be limited.')
        }
      } catch (error) {
        console.error('Failed to load stock data:', error)
        toast.error('Failed to load stock prices. Using cached data.')
      } finally {
        setLoading(false)
      }
    }

    loadStocks()
  }, [])

  // Auto-refresh prices every 30 seconds
  useEffect(() => {
    if (stocks.length === 0) return

    const interval = setInterval(async () => {
      try {
        console.log('🔄 Auto-refreshing token prices...')
        const [stockData, stonksData] = await Promise.all([
          fetchAllStockPrices(),
          fetchStonksPrice()
        ])
        setStocks(stockData)
        setStonksPrice(stonksData)
        setLastUpdated(new Date())
        console.log(`✅ Updated ${stockData.length} stock + STONKS prices automatically`)
      } catch (error) {
        console.warn('Failed to auto-refresh stock prices:', error)
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [stocks.length])

  // Manual refresh function
  const refreshPrices = async () => {
    try {
      setLoading(true)
      const [stockData, stonksData] = await Promise.all([
        fetchAllStockPrices(),
        fetchStonksPrice()
      ])
      setStocks(stockData)
      setStonksPrice(stonksData)
      setLastUpdated(new Date())
      toast.success(`💎 Refreshed ${stockData.length} stock + STONKS prices!`)
    } catch (error) {
      console.error('Failed to refresh stock data:', error)
      toast.error('Failed to refresh prices')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All Stocks', icon: '📊' },
    { id: 'tech', name: 'Technology', icon: '💻' },
    { id: 'finance', name: 'Finance', icon: '🏦' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' }
  ]

  const filteredStocks = selectedCategory === 'all' 
    ? stocks 
    : stocks.filter(stock => stock.category === selectedCategory)

  return (
    <section id="dashboard" className="py-20 px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Trade{' '}
            <span className="text-stonks-green bg-gradient-to-r from-stonks-green to-green-400 bg-clip-text text-transparent">
              Stocks
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Swap $STONKS for stock-pegged SPL tokens instantly. Real-time prices, zero fees.
          </p>
          
          {/* STONKS Price Display */}
          {stonksPrice && (
            <motion.div 
              className="bg-gradient-to-r from-stonks-green/20 to-green-400/20 backdrop-blur-sm border border-stonks-green/30 rounded-xl p-4 mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-stonks-green mb-1">
                    💎 $STONKS
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(stonksPrice.price)}
                  </div>
                  <div className={`text-sm font-medium ${
                    stonksPrice.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPriceChange(stonksPrice.changePercent)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stonksPrice.source}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Real-time indicator and refresh button */}
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{loading ? 'Loading...' : 'Live Prices'}</span>
            </div>
            {lastUpdated && (
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
            )}
            <button
              onClick={refreshPrices}
              disabled={loading}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-stonks-green transition-colors disabled:opacity-50"
            >
              {loading ? '↻' : '🔄'} Refresh
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-stonks-green text-white shadow-lg shadow-stonks-green/30'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Market Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="glass-effect p-6 text-center">
            <div className="text-2xl font-bold text-stonks-green">{stocks.length}</div>
            <div className="text-sm text-gray-400">Available Stocks</div>
          </div>
          <div className="glass-effect p-6 text-center">
            <div className="text-2xl font-bold text-stonks-green">
              {stocks.filter(s => s.change >= 0).length}/{stocks.length}
            </div>
            <div className="text-sm text-gray-400">Stocks Up Today</div>
          </div>
          <div className="glass-effect p-6 text-center">
            <div className="text-2xl font-bold text-stonks-green">24/7</div>
            <div className="text-sm text-gray-400">Trading Hours</div>
          </div>
          <div className="glass-effect p-6 text-center">
            <div className="text-2xl font-bold text-stonks-green">
              {stocks.length > 0 
                ? `${((stocks.filter(s => s.change >= 0).length / stocks.length) * 100).toFixed(0)}%`
                : '0%'
              }
            </div>
            <div className="text-sm text-gray-400">Market Positive</div>
          </div>
        </motion.div>

        {/* Stocks Grid */}
        {loading && stocks.length === 0 ? (
          // Loading skeleton
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[...Array(9)].map((_, index) => (
              <div key={index} className="card-3d p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div>
                    <div className="w-16 h-4 bg-gray-700 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="w-20 h-6 bg-gray-700 rounded mb-2"></div>
                <div className="w-16 h-4 bg-gray-700 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="w-full h-10 bg-gray-700 rounded"></div>
                  <div className="w-full h-10 bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {filteredStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 100 
                }}
              >
                <StockCard stock={stock} stonksPrice={stonksPrice} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No results message */}
        {!loading && filteredStocks.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-400 text-lg">No stocks found for the selected category.</p>
          </motion.div>
        )}



        {/* Background particles for extra flair */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-stonks-green/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard 
