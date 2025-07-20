// Stock Token Price Service
// Fetches real-time prices from Jupiter for your actual stock tokens on Solana

// Jupiter Lite API (free tier, no API key required)
const JUPITER_LITE_API = 'https://lite-api.jup.ag/v4/price'
// DexScreener API (free, no API key, perfect for Solana tokens)
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens'

// Your actual stock token addresses (with "x" suffix tokens)
const STOCK_TOKEN_ADDRESSES = {
  STONKS: '6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump',
  NVDAx: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh',
  TSLAx: 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB', 
  SPYx: 'XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W',
  CRCLx: 'XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1',
  MSTRx: 'XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ',
  GOOGLx: 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN',
  AAPLx: 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
  MCDx: 'XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2',
  METAx: 'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu'
}

// Cache configuration
const CACHE_DURATION = 30000 // 30 seconds
const priceCache = new Map()

// Price formatting helpers
export const formatPrice = (price) => {
  if (!price && price !== 0) return '--'
  
  if (price < 0.01) {
    return `$${price.toFixed(6)}`
  } else if (price < 1) {
    return `$${price.toFixed(4)}`
  } else {
    return `$${price.toFixed(2)}`
  }
}

export const formatPriceChange = (change) => {
  if (!change && change !== 0) return '--'
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

// Fetch token price from Jupiter
const fetchFromJupiter = async (symbol) => {
  try {
    const tokenAddress = STOCK_TOKEN_ADDRESSES[symbol]
    if (!tokenAddress) {
      throw new Error(`No token address found for ${symbol}`)
    }
    
    console.log(`🔍 Fetching real price for ${symbol}: ${tokenAddress}`)
    
    // Try Jupiter Lite API (free tier, no API key)
    let response = await fetch(
      `${JUPITER_LITE_API}?ids=${tokenAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Stonks/1.0'
        }
      }
    )
    
    let tokenData = null
    
    if (response.ok) {
      const data = await response.json()
      tokenData = data.data?.[tokenAddress]
      console.log(`✅ Jupiter Lite API response for ${symbol}:`, tokenData)
    } else {
      console.log(`❌ Jupiter Lite API error for ${symbol}: ${response.status}`)
    }
    
    // If Jupiter fails, try DexScreener API (excellent for Solana tokens)
    if (!tokenData) {
      console.log(`🔍 Trying DexScreener API for ${symbol}`)
      
      response = await fetch(
        `${DEXSCREENER_API}/${tokenAddress}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Stonks/1.0'
          }
        }
      )
      
      if (response.ok) {
        const dexData = await response.json()
        console.log(`✅ DexScreener response for ${symbol}:`, dexData)
        
        // DexScreener returns pairs, we need to find the best one (usually USDC pair)
        if (dexData.pairs && dexData.pairs.length > 0) {
          // Find USDC pair or take the first liquid pair
          const usdcPair = dexData.pairs.find(pair => 
            pair.quoteToken?.symbol === 'USDC' || 
            pair.quoteToken?.symbol === 'USDT' ||
            pair.baseToken?.symbol === 'SOL'
          ) || dexData.pairs[0]
          
          if (usdcPair && usdcPair.priceUsd) {
            tokenData = {
              price: parseFloat(usdcPair.priceUsd),
              priceChange24h: usdcPair.priceChange?.h24 || 0
            }
            console.log(`💎 Found ${symbol} price on DexScreener: $${tokenData.price}`)
          }
        }
      } else {
        console.log(`❌ DexScreener API error for ${symbol}: ${response.status}`)
      }
    }
    
    // If still no data, try to find it on other Solana DEXes via DexScreener
    if (!tokenData) {
      console.log(`🔍 Trying DexScreener search for ${symbol} token`)
      
      try {
        // Try DexScreener search endpoint
        response = await fetch(
          `https://api.dexscreener.com/latest/dex/search/?q=${tokenAddress}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Stonks/1.0'
            }
          }
        )
        
        if (response.ok) {
          const searchData = await response.json()
          console.log(`🔍 DexScreener search for ${symbol}:`, searchData?.pairs?.length || 0, 'pairs found')
          
          if (searchData.pairs && searchData.pairs.length > 0) {
            // Filter for Solana pairs and find the most liquid one
            const solanaPairs = searchData.pairs.filter(pair => 
              pair.chainId === 'solana' && 
              pair.priceUsd && 
              parseFloat(pair.priceUsd) > 0
            )
            
            if (solanaPairs.length > 0) {
              // Sort by volume and take the most liquid pair
              const bestPair = solanaPairs.sort((a, b) => 
                (b.volume?.h24 || 0) - (a.volume?.h24 || 0)
              )[0]
              
              tokenData = {
                price: parseFloat(bestPair.priceUsd),
                priceChange24h: bestPair.priceChange?.h24 || 0
              }
              console.log(`💎 Found ${symbol} on DEX: $${tokenData.price} (Volume: $${bestPair.volume?.h24 || 0})`)
            }
          }
        }
      } catch (error) {
        console.log(`DexScreener search failed for ${symbol}:`, error.message)
      }
    }
    
    if (!tokenData) {
      throw new Error('Token not found on Jupiter or DexScreener - may need more liquidity')
    }
    
    const price = tokenData.price
    const change = tokenData.priceChange24h || 0
    
    console.log(`💰 ${symbol}: $${price} (${change > 0 ? '+' : ''}${change?.toFixed(2)}%) - REAL TOKEN PRICE FROM DEX`)
    
    return {
      symbol,
      price: parseFloat(price),
      change: change,
      changePercent: change,
      timestamp: Date.now(),
      source: 'DEX Token Price',
      tokenAddress
    }
  } catch (error) {
    console.error(`Jupiter error for ${symbol}:`, error)
    throw error
  }
}

// Fallback when token is not found on any DEX
const getTokenNotFoundFallback = (symbol) => {
  console.warn(`⚠️ Token ${symbol} not found on DEXes - needs more liquidity or trading volume`)
  
  return {
    symbol,
    price: 0.001, // $0.001 default for new tokens
    change: 0,
    changePercent: 0,
    timestamp: Date.now(),
    source: 'Token Not Listed Yet',
    error: 'Token needs more liquidity to appear on DEXes'
  }
}

// Fetch single stock token price from Jupiter
export const fetchStockPrice = async (symbol) => {
  // Check cache first
  const cacheKey = symbol
  const cached = priceCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached
  }
  
  try {
    // Fetch from Jupiter (primary source for real token prices)
    const result = await fetchFromJupiter(symbol)
    
    // Cache successful result
    priceCache.set(cacheKey, result)
    
    return result
  } catch (error) {
    console.warn(`Token ${symbol} not found on DEXes:`, error.message)
    
    // Token not found on any DEX - likely needs more liquidity
    const fallback = getTokenNotFoundFallback(symbol)
    priceCache.set(cacheKey, fallback)
    return fallback
  }
}

// Fetch multiple stock token prices concurrently from Jupiter
export const fetchStockPrices = async (symbols) => {
  console.log(`🚀 Fetching Jupiter prices for tokens: ${symbols.join(', ')}`)
  
  const promises = symbols.map(symbol => 
    fetchStockPrice(symbol).catch(error => ({
      symbol,
      error: error.message,
      timestamp: Date.now()
    }))
  )
  
  const results = await Promise.all(promises)
  
  // Convert array to object with symbol as key
  const priceData = {}
  results.forEach(result => {
    priceData[result.symbol] = result
    if (result.price) {
      console.log(`💎 ${result.symbol}: ${formatPrice(result.price)} (${formatPriceChange(result.change)}) [${result.source}]`)
    }
  })
  
  return priceData
}

// Batch fetch all stock prices with automatic caching (excluding STONKS)
export const fetchAllStockPrices = async () => {
  const symbols = Object.keys(STOCK_TOKEN_ADDRESSES).filter(symbol => symbol !== 'STONKS')
  const priceData = await fetchStockPrices(symbols)
  
  // Convert object to array format expected by Dashboard
  const stockArray = symbols.map(symbol => {
    const data = priceData[symbol]
    return {
      symbol,
      name: getStockName(symbol),
      category: getStockCategory(symbol),
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      timestamp: data.timestamp,
      source: data.source,
      mint: STOCK_TOKEN_ADDRESSES[symbol]
    }
  })
  
  return stockArray
}

// Separate function to fetch STONKS price (skip Jupiter, go directly to DexScreener)
export const fetchStonksPrice = async () => {
  try {
    console.log('🪙 Fetching STONKS price from DexScreener...')
    
    // Skip Jupiter for STONKS and go directly to DexScreener since Jupiter doesn't index it yet
    const stonksAddress = STOCK_TOKEN_ADDRESSES.STONKS
    
    const response = await fetch(
      `${DEXSCREENER_API}/${stonksAddress}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Stonks/1.0'
        }
      }
    )
    
    if (response.ok) {
      const dexData = await response.json()
      console.log('✅ DexScreener STONKS data:', dexData)
      
      if (dexData.pairs && dexData.pairs.length > 0) {
        // Find best USDC/SOL pair
        const bestPair = dexData.pairs.find(pair => 
          pair.quoteToken?.symbol === 'USDC' || 
          pair.quoteToken?.symbol === 'USDT' ||
          pair.baseToken?.symbol === 'SOL'
        ) || dexData.pairs[0]
        
        if (bestPair && bestPair.priceUsd) {
          const price = parseFloat(bestPair.priceUsd)
          const change = bestPair.priceChange?.h24 || 0
          
          console.log(`💎 STONKS price found: $${price} (${change > 0 ? '+' : ''}${change.toFixed(2)}%)`)
          
          return {
            symbol: 'STONKS',
            name: 'Stonks Token',
            price: price,
            change: change,
            changePercent: change,
            timestamp: Date.now(),
            source: 'DexScreener Live Price',
            mint: stonksAddress
          }
        }
      }
    }
    
    throw new Error('STONKS price not found on DexScreener')
    
  } catch (error) {
    console.warn('❌ Failed to fetch STONKS price:', error)
    
    // Fallback with a reasonable default
    return {
      symbol: 'STONKS',
      name: 'Stonks Token',
      price: 0.024, // Last known good price
      change: 0,
      changePercent: 0,
      timestamp: Date.now(),
      source: 'Price Feed Unavailable',
      mint: STOCK_TOKEN_ADDRESSES.STONKS
    }
  }
}

// Helper functions for stock metadata
const getStockName = (symbol) => {
  const names = {
    STONKS: 'Stonks Token',
    NVDAx: 'NVIDIA Corporation',
    TSLAx: 'Tesla Inc.',
    SPYx: 'SPDR S&P 500 ETF',
    CRCLx: 'Circle USD',
    MSTRx: 'MicroStrategy Inc.',
    GOOGLx: 'Alphabet Inc.',
    AAPLx: 'Apple Inc.',
    MCDx: 'McDonald\'s Corporation',
    METAx: 'Meta Platforms Inc.'
  }
  return names[symbol] || `${symbol} Token`
}

const getStockCategory = (symbol) => {
  const categories = {
    STONKS: 'platform',
    NVDAx: 'tech',
    TSLAx: 'tech',
    SPYx: 'etf',
    CRCLx: 'finance',
    MSTRx: 'tech',
    GOOGLx: 'tech',
    AAPLx: 'tech',
    MCDx: 'consumer',
    METAx: 'tech'
  }
  return categories[symbol] || 'tech'
}

// Get cached price without refetching
export const getCachedPrice = (symbol) => {
  return priceCache.get(symbol)
}

// Clear price cache
export const clearPriceCache = () => {
  priceCache.clear()
}

// Get all available stock symbols
export const getAvailableSymbols = () => {
  return Object.keys(STOCK_TOKEN_ADDRESSES)
}

// Get token address for symbol
export const getTokenAddress = (symbol) => {
  return STOCK_TOKEN_ADDRESSES[symbol]
}

console.log('📊 Stock Token Price Service initialized with Jupiter API') 
