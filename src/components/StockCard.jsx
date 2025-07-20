import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'
import toast from 'react-hot-toast'
import { formatPrice, formatPriceChange } from '../services/stockPriceService'
import { executeRpcWithRetry, getRpcErrorMessage } from '../utils/rpcUtils'

function StockCard({ stock, stonksPrice }) {
  const { connected, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)
  const [swapDirection, setSwapDirection] = useState(null) // 'buy' or 'sell'
  const [amount, setAmount] = useState('')

  // Real exchange rate calculation based on actual token prices
  const stonksUsdPrice = stonksPrice?.price || 0.001
  const stockUsdPrice = stock.price
  
  // How many stock tokens you get for 1 STONKS
  const stonksToStockRate = stonksUsdPrice / stockUsdPrice
  
  // How many STONKS you need for 1 stock token
  const stockToStonksRate = stockUsdPrice / stonksUsdPrice

  // Check wallet balances before swap with CORS-enabled RPC and retry logic
  const checkWalletBalance = async (direction, amount) => {
    try {
      console.log('🔍 Checking wallet balances with CORS-enabled RPC...')
      
      const amountLamports = Math.floor(parseFloat(amount) * 1e9)
      
      if (direction === 'buy') {
        // Check STONKS balance for buying with retry
        const stonksTokenAccount = await executeRpcWithRetry(
          () => connection.getTokenAccountsByOwner(
            publicKey,
            { mint: new PublicKey('6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump') }
          ),
          3, // 3 retries
          8000 // 8 second timeout
        )
        
        if (stonksTokenAccount.value.length === 0) {
          throw new Error('No STONKS tokens found in wallet. Get some STONKS first!')
        }
        
        const accountInfo = await executeRpcWithRetry(
          () => connection.getTokenAccountBalance(stonksTokenAccount.value[0].pubkey),
          3,
          8000
        )
        const balance = parseInt(accountInfo.value.amount)
        const decimals = accountInfo.value.decimals || 9 // Use actual decimals from token account
        const divisor = Math.pow(10, decimals)
        const amountRequired = Math.floor(parseFloat(amount) * divisor)
        
        if (balance < amountRequired) {
          const balanceFormatted = (balance / divisor).toFixed(6)
          throw new Error(`Insufficient STONKS balance. You have ${balanceFormatted} STONKS, need ${amount}`)
        }
        
        console.log(`✅ STONKS balance check passed: ${(balance / divisor).toFixed(6)} available (${decimals} decimals)`)
        
      } else {
        // Check stock token balance for selling with retry
        const stockTokenAccount = await executeRpcWithRetry(
          () => connection.getTokenAccountsByOwner(
            publicKey,
            { mint: new PublicKey(stock.mint) }
          ),
          3,
          8000
        )
        
        if (stockTokenAccount.value.length === 0) {
          throw new Error(`No ${stock.symbol} tokens found in wallet. Buy some first!`)
        }
        
        const accountInfo = await executeRpcWithRetry(
          () => connection.getTokenAccountBalance(stockTokenAccount.value[0].pubkey),
          3,
          8000
        )
        const balance = parseInt(accountInfo.value.amount)
        const decimals = accountInfo.value.decimals || 9 // Use actual decimals from token account
        const divisor = Math.pow(10, decimals)
        const amountRequired = Math.floor(parseFloat(amount) * divisor)
        
        if (balance < amountRequired) {
          const balanceFormatted = (balance / divisor).toFixed(6)
          throw new Error(`Insufficient ${stock.symbol} balance. You have ${balanceFormatted} ${stock.symbol}, need ${amount}`)
        }
        
        console.log(`✅ ${stock.symbol} balance check passed: ${(balance / divisor).toFixed(6)} available (${decimals} decimals)`)
      }
      
      // Check SOL balance for transaction fees with retry
      const solBalance = await executeRpcWithRetry(
        () => connection.getBalance(publicKey),
        3,
        8000
      )
      if (solBalance < 5000) { // 0.000005 SOL minimum for fees
        throw new Error('Insufficient SOL for transaction fees. You need at least 0.000005 SOL.')
      }
      
      console.log('✅ All balance checks passed!')
      return true
    } catch (error) {
      console.error('❌ Balance check failed:', error)
      throw error // Let the main error handler deal with it
    }
  }

  // Execute Jupiter swap with balance checking
  const executeSwap = useCallback(async (direction, amount) => {
    if (!connected || !publicKey) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    
    try {
      // Check wallet balances BEFORE attempting swap
      console.log('🔍 Checking wallet balances...')
      await checkWalletBalance(direction, amount)
      console.log('✅ Balance check passed, proceeding with swap...')
      
                    // Real Jupiter swap implementation with exact token addresses
       try {
         console.log('🚀 Starting Jupiter swap...')
         console.log('Stock token data:', { symbol: stock.symbol, mint: stock.mint })
         
         const { createJupiterApiClient } = await import('@jup-ag/api')
         
         const jupiterQuoteApi = createJupiterApiClient()
         
         // Your exact token contract addresses
         const STONKS_TOKEN = '6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump'
         const STOCK_TOKEN = stock.mint
         
         // Validate token addresses
         if (!STOCK_TOKEN) {
           throw new Error(`Stock token ${stock.symbol} does not have a mint address`)
         }
         
         const inputMint = direction === 'buy' 
           ? STONKS_TOKEN // STONKS token
           : STOCK_TOKEN  // Stock token
         const outputMint = direction === 'buy'
           ? STOCK_TOKEN  // Stock token
           : STONKS_TOKEN // STONKS token
         
         // Get token decimals for accurate amount calculation
         const { getMint } = await import('@solana/spl-token')
         
         let inputAmount
         try {
           if (direction === 'buy') {
             // User entered STONKS amount - get STONKS decimals
             const stonksMint = await getMint(connection, new PublicKey(STONKS_TOKEN))
             const decimals = stonksMint.decimals
             inputAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals))
             console.log(`💰 STONKS input: ${amount} tokens = ${inputAmount} smallest units (${decimals} decimals)`)
           } else {
             // User entered stock token amount - get stock token decimals  
             const stockMint = await getMint(connection, new PublicKey(STOCK_TOKEN))
             const decimals = stockMint.decimals
             inputAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals))
             console.log(`💰 ${stock.symbol} input: ${amount} tokens = ${inputAmount} smallest units (${decimals} decimals)`)
             console.log(`🔍 DEBUG: User typed "${amount}", parsed as ${parseFloat(amount)}, multiplied by 10^${decimals} = ${parseFloat(amount) * Math.pow(10, decimals)}, floored to ${inputAmount}`)
             console.log(`🔍 DEBUG: Reverse calculation: ${inputAmount} / 10^${decimals} = ${inputAmount / Math.pow(10, decimals)}`)
           }
         } catch (mintError) {
           console.warn('Could not get mint info, trying alternative method:', mintError)
           // Try to get decimals from parsed account info
           try {
             const mintPublicKey = direction === 'buy' ? new PublicKey(STONKS_TOKEN) : new PublicKey(STOCK_TOKEN)
             const mintInfo = await connection.getParsedAccountInfo(mintPublicKey)
             if (mintInfo.value?.data?.parsed?.info?.decimals !== undefined) {
               const decimals = mintInfo.value.data.parsed.info.decimals
               inputAmount = Math.floor(parseFloat(amount) * Math.pow(10, decimals))
               console.log(`💰 Using parsed mint info: ${decimals} decimals, amount = ${inputAmount}`)
               if (direction === 'sell') {
                 console.log(`🔍 DEBUG: User typed "${amount}", parsed as ${parseFloat(amount)}, multiplied by 10^${decimals} = ${parseFloat(amount) * Math.pow(10, decimals)}, floored to ${inputAmount}`)
                 console.log(`🔍 DEBUG: Reverse calculation: ${inputAmount} / 10^${decimals} = ${inputAmount / Math.pow(10, decimals)}`)
               }
             } else {
               throw new Error('Could not get decimals from parsed account info')
             }
           } catch (parseError) {
             console.warn('Could not get parsed mint info, using 9 decimals as fallback:', parseError)
             inputAmount = Math.floor(parseFloat(amount) * 1e9)
           }
         }
         
         console.log('🔄 Getting Jupiter quote:', { 
           direction,
           inputMint, 
           outputMint, 
           inputAmount,
           inputToken: direction === 'buy' ? 'STONKS' : stock.symbol,
           outputToken: direction === 'buy' ? stock.symbol : 'STONKS',
           stonksPrice: stonksUsdPrice,
           stockPrice: stockUsdPrice,
           expectedRate: direction === 'buy' ? stonksToStockRate : stockToStonksRate
         })
         
         console.log('📡 Calling Jupiter API for quote...')
         
         const quoteResponse = await jupiterQuoteApi.quoteGet({
           inputMint,
           outputMint,
           amount: inputAmount.toString(),
           slippageBps: 50, // 0.5% slippage
           onlyDirectRoutes: false,
           asLegacyTransaction: false
         })
         
         if (!quoteResponse) {
           throw new Error(`No Jupiter route found for ${direction === 'buy' ? 'STONKS' : stock.symbol} → ${direction === 'buy' ? stock.symbol : 'STONKS'}`)
         }
         
         console.log('✅ Jupiter quote received:', {
           inputAmount: quoteResponse.inAmount,
           outputAmount: quoteResponse.outAmount,
           priceImpact: quoteResponse.priceImpactPct,
           routeLength: quoteResponse.routePlan?.length || 0
         })
         
         console.log('🔨 Creating swap transaction...')
         
         const swapResponse = await jupiterQuoteApi.swapPost({
           swapRequest: {
             quoteResponse,
             userPublicKey: publicKey.toString(),
             wrapAndUnwrapSol: true,
             useSharedAccounts: true,
             feeAccount: undefined,
             trackingAccount: undefined,
             computeUnitPriceMicroLamports: undefined,
             prioritizationFeeLamports: undefined,
             asLegacyTransaction: false
           }
         })
         
         if (!swapResponse || !swapResponse.swapTransaction) {
           throw new Error('Jupiter failed to create swap transaction')
         }
         
         console.log('✅ Swap transaction created successfully')
         
         // Decode and send the transaction (handle both legacy and versioned transactions)
         const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64')
         let transaction
         
         try {
           // Try versioned transaction first (Jupiter's new format)
           transaction = VersionedTransaction.deserialize(swapTransactionBuf)
           console.log('Using versioned transaction...')
         } catch (e) {
           // Fallback to legacy transaction format
           transaction = Transaction.from(swapTransactionBuf)
           console.log('Using legacy transaction...')
         }
         
         console.log('Sending transaction...')
         const txid = await sendTransaction(transaction, connection)
         
         console.log('✅ Transaction sent:', txid)
         
         // Wait for confirmation with better error handling
         try {
           const confirmation = await connection.confirmTransaction(txid, 'confirmed')
           console.log('✅ Transaction confirmed:', confirmation)
           
           // Calculate actual amounts swapped
           const inputTokenName = direction === 'buy' ? 'STONKS' : stock.symbol
           const outputTokenName = direction === 'buy' ? stock.symbol : 'STONKS'
           const outputAmountFormatted = (parseFloat(quoteResponse.outAmount) / 1e9).toFixed(6)
           
           toast.success(`🎉 Swap successful! Traded ${amount} ${inputTokenName} for ${outputAmountFormatted} ${outputTokenName}`)
           
           return txid
         } catch (confirmError) {
           console.warn('Transaction may still succeed, confirmation timeout:', confirmError)
           toast.success(`🚀 Swap submitted! Transaction: ${txid}`)
           return txid
         }
       } catch (jupiterError) {
         console.error('❌ Jupiter swap failed:', jupiterError)
         
                 // More specific error messages with helpful suggestions
        if (jupiterError.message?.includes('No route found') || jupiterError.message?.includes('error code') || jupiterError.message?.includes('Response returned an error code')) {
          throw new Error(`💡 Amount too small! Try swapping more ${direction === 'buy' ? 'STONKS' : stock.symbol} for better liquidity.`)
        } else if (jupiterError.message?.includes('Insufficient')) {
          throw new Error(`❌ Insufficient ${direction === 'buy' ? 'STONKS' : stock.symbol} balance in your wallet.`)
        } else if (jupiterError.message?.includes('User rejected')) {
          throw new Error('❌ Transaction was rejected. Please try again.')
        } else {
          throw new Error(`❌ Jupiter swap failed: ${jupiterError.message}`)
        }
       }
      
      // Real swap completed successfully
      console.log('🎉 Swap completed successfully!')
      setAmount('')
      setSwapDirection(null)
      
    } catch (error) {
      console.error('❌ Swap failed:', error)
      
      // Handle specific error types with helpful suggestions
      if (error.message?.includes('Amount too small') || error.message?.includes('No liquidity route') || error.message?.includes('No route found')) {
        toast.error(error.message, { duration: 6000 })
      } else if (error.message?.includes('Insufficient')) {
        toast.error(`💰 ${error.message}`)
      } else if (error.message?.includes('User rejected')) {
        toast.error('❌ Transaction was rejected. Please try again.')
      } else {
        // Use the RPC utility for better error messages
        toast.error(getRpcErrorMessage(error))
      }
    } finally {
      setIsLoading(false)
    }
  }, [connected, publicKey, connection, stock])

  const handleSwapClick = (direction) => {
    if (!connected) {
      toast.error('Please connect your wallet to trade')
      return
    }
    setSwapDirection(direction)
  }

  return (
    <motion.div
      className="card-3d p-6 h-full flex flex-col justify-between"
      whileHover={{ y: -8, rotateX: 5 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      {/* Stock Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Stock logo placeholder */}
            <div className="w-12 h-12 bg-gradient-to-br from-stonks-green/20 to-green-600/20 border border-stonks-green/30 rounded-lg flex items-center justify-center text-sm font-bold text-stonks-green">
              {stock.symbol}
            </div>
            <div>
              <h3 className="font-heading text-lg font-semibold text-white">
                {stock.symbol}
              </h3>
              <p className="text-sm text-gray-400 truncate max-w-32">
                {stock.name}
              </p>
            </div>
          </div>
          
          {/* Price change indicator */}
          <div className={`px-2 py-1 rounded text-xs font-semibold ${
            stock.change >= 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {stock.change >= 0 ? '↗' : '↘'} {Math.abs(stock.changePercent).toFixed(2)}%
          </div>
        </div>

        {/* Price */}
        <div className="mb-2">
          <div className="text-2xl font-bold text-white">
            {formatPrice(stock.price)}
          </div>
          <div className={`text-sm ${
            stock.change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatPriceChange(stock.change, stock.changePercent)}
          </div>
        </div>

        {/* Exchange Rate */}
        <div className="text-sm text-gray-400 mb-4 bg-gray-800/20 border border-gray-700 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2 text-center">Live Exchange Rates</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>1 STONKS =</span>
              <span className="text-stonks-green font-semibold">
                {stonksToStockRate < 0.000001 
                  ? stonksToStockRate.toExponential(2)
                  : stonksToStockRate.toFixed(6)
                } {stock.symbol}
              </span>
            </div>
            <div className="flex justify-between">
              <span>1 {stock.symbol} =</span>
              <span className="text-stonks-green font-semibold">
                {stockToStonksRate.toFixed(0)} STONKS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap Interface */}
      {swapDirection ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              {swapDirection === 'buy' ? 'Buy' : 'Sell'} {stock.symbol}
            </h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                {swapDirection === 'buy' 
                  ? `Enter STONKS amount to spend (≈$${formatPrice(stonksUsdPrice)})` 
                  : `Enter ${stock.symbol} amount to sell (≈${formatPrice(stockUsdPrice)})`
                }
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-stonks-green focus:outline-none"
                min="0"
                step="any"
              />
            </div>
            
            {amount && parseFloat(amount) > 0 && (
              <div className="bg-gray-800/30 border border-gray-600 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 mb-1">You will receive approximately:</div>
                <div className="text-lg font-semibold text-white">
                  {swapDirection === 'buy' 
                    ? (parseFloat(amount) * stonksToStockRate).toFixed(6)
                    : (parseFloat(amount) * stockToStonksRate).toFixed(2)
                  } {swapDirection === 'buy' ? stock.symbol : 'STONKS'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ≈ ${swapDirection === 'buy' 
                    ? (parseFloat(amount) * stonksUsdPrice).toFixed(2)
                    : (parseFloat(amount) * stockUsdPrice).toFixed(2)
                  } USD value
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => executeSwap(swapDirection, amount)}
              disabled={isLoading || !amount}
              className="flex-1 btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Swapping...</span>
                </div>
              ) : (
                `Confirm ${swapDirection === 'buy' ? 'Buy' : 'Sell'}`
              )}
            </button>
            <button
              onClick={() => {
                setSwapDirection(null)
                setAmount('')
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        // Trading Buttons
        <div className="space-y-3">
          <motion.button
            onClick={() => handleSwapClick('buy')}
            className="w-full btn-3d bg-green-600 hover:bg-green-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!connected}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📈</span>
              <span>Buy {stock.symbol}</span>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => handleSwapClick('sell')}
            className="w-full btn-3d bg-red-600 hover:bg-red-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!connected}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>📉</span>
              <span>Sell {stock.symbol}</span>
            </div>
          </motion.button>
          
          {/* Jupiter availability indicator */}
          {['MCDx', 'METAx'].includes(stock.symbol) && (
            <div className="text-xs text-yellow-400 text-center mt-2 px-2 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded">
              ⚠️ Limited Jupiter liquidity - trades may fail
            </div>
          )}

          {!connected && (
            <p className="text-xs text-gray-500 text-center mt-2">
              Connect wallet to trade
            </p>
          )}
        </div>
      )}

      {/* Price Chart Placeholder */}
      <div className="mt-4 h-16 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded border border-gray-700/50 flex items-center justify-center">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>📊</span>
          <span>Mini chart coming soon</span>
        </div>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        style={{
          background: 'linear-gradient(45deg, rgba(63, 191, 63, 0.1), rgba(34, 197, 94, 0.1))',
          boxShadow: '0 0 30px rgba(63, 191, 63, 0.2)',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default StockCard 
