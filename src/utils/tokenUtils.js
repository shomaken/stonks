import { PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token'

/**
 * Get token balance for a specific wallet and token mint
 * @param {Connection} connection - Solana connection
 * @param {string} walletAddress - Wallet public key as string
 * @param {string} mintAddress - Token mint address
 * @returns {Promise<number>} - Token balance (already adjusted for decimals)
 */
export async function getTokenBalance(connection, walletAddress, mintAddress) {
  try {
    console.log(`🔍 Getting balance for wallet: ${walletAddress}, mint: ${mintAddress}`)
    
    const walletPublicKey = new PublicKey(walletAddress)
    const mintPublicKey = new PublicKey(mintAddress)
    
    // Use the same method as StockCard: find ALL token accounts for this mint
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletPublicKey,
      { mint: mintPublicKey }
    )
    
    console.log(`🔍 Found ${tokenAccounts.value.length} token accounts for ${mintAddress}`)
    
    if (tokenAccounts.value.length === 0) {
      console.log(`ℹ️ No token accounts found for ${mintAddress}`)
      return 0
    }
    
    // Get the balance from the first (and usually only) token account
    const accountInfo = await connection.getTokenAccountBalance(tokenAccounts.value[0].pubkey)
    const balance = parseFloat(accountInfo.value.uiAmount || 0)
    
    console.log(`✅ Token balance found: ${balance} for ${mintAddress}`)
    return balance
    
  } catch (error) {
    console.error(`❌ Error getting token balance for ${mintAddress}:`, error)
    return 0
  }
}

/**
 * Get multiple token balances at once
 * @param {Connection} connection - Solana connection  
 * @param {string} walletAddress - Wallet public key as string
 * @param {Array<string>} mintAddresses - Array of token mint addresses
 * @returns {Promise<Object>} - Object with mint addresses as keys and balances as values
 */
export async function getMultipleTokenBalances(connection, walletAddress, mintAddresses) {
  const balances = {}
  
  await Promise.all(
    mintAddresses.map(async (mintAddress) => {
      try {
        const balance = await getTokenBalance(connection, walletAddress, mintAddress)
        balances[mintAddress] = balance
      } catch (error) {
        console.error(`Failed to get balance for ${mintAddress}:`, error)
        balances[mintAddress] = 0
      }
    })
  )
  
  return balances
}

/**
 * Check if a wallet has a token account for a specific mint
 * @param {Connection} connection - Solana connection
 * @param {string} walletAddress - Wallet public key as string  
 * @param {string} mintAddress - Token mint address
 * @returns {Promise<boolean>} - True if token account exists
 */
export async function hasTokenAccount(connection, walletAddress, mintAddress) {
  try {
    const walletPublicKey = new PublicKey(walletAddress)
    const mintPublicKey = new PublicKey(mintAddress)
    
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    )
    
    const accountInfo = await connection.getAccountInfo(associatedTokenAddress)
    return accountInfo !== null
  } catch (error) {
    return false
  }
}

/**
 * Format token balance for display
 * @param {number} balance - Raw balance 
 * @param {number} maxDecimals - Maximum decimal places to show
 * @returns {string} - Formatted balance string
 */
export function formatTokenBalance(balance, maxDecimals = 6) {
  if (balance === 0) return '0'
  if (balance < 0.000001) return '<0.000001'
  
  // For very small amounts, show more decimals
  if (balance < 0.01) {
    return balance.toFixed(6)
  }
  
  // For normal amounts, show 2-4 decimals
  if (balance < 1) {
    return balance.toFixed(4)
  }
  
  return balance.toFixed(2)
} 
