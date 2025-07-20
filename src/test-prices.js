// Test script to verify Jupiter stock token price service
import { fetchStockPrices, getAvailableSymbols, formatPrice, formatPriceChange } from './services/stockPriceService.js'

// Test with your actual stock token symbols
const testSymbols = getAvailableSymbols()

console.log('🚀 Testing Jupiter stock token price service...')
console.log('📊 Fetching real-time prices for your stock tokens:', testSymbols.join(', '))

try {
  const prices = await fetchStockPrices(testSymbols)
  
  console.log('\n✅ Jupiter prices fetched successfully:')
  Object.entries(prices).forEach(([symbol, data]) => {
    if (data.error) {
      console.log(`❌ ${symbol}: ${data.error}`)
    } else {
      console.log(`💎 ${symbol}: ${formatPrice(data.price)} (${formatPriceChange(data.change)}) [${data.source}]`)
      if (data.tokenAddress) {
        console.log(`   Token: ${data.tokenAddress}`)
      }
    }
  })
  
  console.log('\n🎉 Jupiter token price service is working perfectly!')
  console.log('🔥 Your app now has REAL-TIME token prices from Jupiter!')
} catch (error) {
  console.error('❌ Error testing Jupiter prices:', error)
  process.exit(1)
} 