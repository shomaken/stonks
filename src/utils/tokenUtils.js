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
    const walletPublicKey = new PublicKey(walletAddress)
    const mintPublicKey = new PublicKey(mintAddress)
    
    // Get the associated token account address
    const associatedTokenAddress = await getAssociatedTokenAddress(
      mintPublicKey,
      walletPublicKey
    )
    
    try {
      // Try to get the account info
      const accountInfo = await getAccount(connection, associatedTokenAddress)
      
      // Get mint info to determine decimals
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey)
      const decimals = mintInfo.value?.data?.parsed?.info?.decimals || 6
      
      // Convert balance to human-readable format
      const balance = Number(accountInfo.amount) / Math.pow(10, decimals)
      return balance
    } catch (accountError) {
      // Account doesn't exist or has no balance
      if (accountError.name === 'TokenAccountNotFoundError' || 
          accountError.message?.includes('could not find account')) {
        return 0
      }
      throw accountError
    }
  } catch (error) {
    console.error(`Error getting token balance for ${mintAddress}:`, error)
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