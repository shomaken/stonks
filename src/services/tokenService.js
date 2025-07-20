// Token Service for managing STONKS and stock token integration
import { Connection, PublicKey } from '@solana/web3.js'
import { getMint, getAccount } from '@solana/spl-token'

// Token configuration
export const TOKEN_CONFIG = {
  STONKS: {
    mint: import.meta.env.VITE_STONKS_MINT || '6NcdiK8B5KK2DzKvzvCfqi8EHaEqu48fyEzC8Mm9pump',
    symbol: 'STONKS',
    name: 'Stonks Token',
    decimals: 9,
    description: 'The main trading token for the Stonks platform'
  },
  STOCKS: {
    NVDAx: {
      mint: import.meta.env.VITE_NVDA_MINT || 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh',
      symbol: 'NVDAx',
      name: 'NVIDIA Corporation',
      category: 'tech'
    },
    TSLAx: {
      mint: import.meta.env.VITE_TSLA_MINT || 'XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB',
      symbol: 'TSLAx', 
      name: 'Tesla Inc.',
      category: 'tech'
    },
    SPYx: {
      mint: import.meta.env.VITE_SPY_MINT || 'XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W',
      symbol: 'SPYx',
      name: 'SPDR S&P 500 ETF',
      category: 'etf'
    },
    CRCLx: {
      mint: import.meta.env.VITE_CRCL_MINT || 'XsueG8BtpquVJX9LVLLEGuViXUungE6WmK5YZ3p3bd1',
      symbol: 'CRCLx',
      name: 'Circle USD',
      category: 'finance'
    },
    MSTRx: {
      mint: import.meta.env.VITE_MSTR_MINT || 'XsP7xzNPvEHS1m6qfanPUGjNmdnmsLKEoNAnHjdxxyZ',
      symbol: 'MSTRx',
      name: 'MicroStrategy Inc.',
      category: 'tech'
    },
    GOOGLx: {
      mint: import.meta.env.VITE_GOOGL_MINT || 'XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN',
      symbol: 'GOOGLx',
      name: 'Alphabet Inc.',
      category: 'tech'
    },
    AAPLx: {
      mint: import.meta.env.VITE_AAPL_MINT || 'XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp',
      symbol: 'AAPLx',
      name: 'Apple Inc.',
      category: 'tech'
    },
    MCDx: {
      mint: import.meta.env.VITE_MCD_MINT || 'XsqE9cRRpzxcGKDXj1BJ7Xmg4GRhZoyY1KpmGSxAWT2',
      symbol: 'MCDx',
      name: 'McDonald\'s Corporation',
      category: 'consumer'
    },
    METAx: {
      mint: import.meta.env.VITE_META_MINT || 'Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu',
      symbol: 'METAx',
      name: 'Meta Platforms Inc.',
      category: 'tech'
    }
  }
}

// Validate token addresses
export function validateTokenConfig() {
  const issues = []
  
  // Check STONKS token
  if (!TOKEN_CONFIG.STONKS.mint) {
    issues.push('VITE_STONKS_MINT is not configured')
  }
  
  // Check stock tokens
  Object.entries(TOKEN_CONFIG.STOCKS).forEach(([symbol, config]) => {
    if (!config.mint) {
      issues.push(`VITE_${symbol}_MINT is not configured`)
    }
  })
  
  return {
    isValid: issues.length === 0,
    issues
  }
}

// Get token metadata from on-chain
export async function getTokenMetadata(connection, mintAddress) {
  try {
    const mintPublicKey = new PublicKey(mintAddress)
    const mintInfo = await getMint(connection, mintPublicKey)
    
    return {
      address: mintAddress,
      decimals: mintInfo.decimals,
      supply: Number(mintInfo.supply),
      mintAuthority: mintInfo.mintAuthority?.toString(),
      freezeAuthority: mintInfo.freezeAuthority?.toString()
    }
  } catch (error) {
    console.error(`Failed to get metadata for ${mintAddress}:`, error)
    return null
  }
}

// Get user token balance
export async function getUserTokenBalance(connection, walletAddress, mintAddress) {
  try {
    const walletPublicKey = new PublicKey(walletAddress)
    const mintPublicKey = new PublicKey(mintAddress)
    
    // This is simplified - in reality you'd need to find the associated token account
    // or use a library like @solana/spl-token-registry
    const tokenAccount = await getAccount(connection, walletPublicKey)
    return Number(tokenAccount.amount)
  } catch (error) {
    console.error(`Failed to get balance for ${mintAddress}:`, error)
    return 0
  }
}

// Check if token address is valid
export function isValidTokenAddress(address) {
  if (!address || typeof address !== 'string') return false
  
  try {
    new PublicKey(address)
    return address.length >= 32 && address.length <= 44
  } catch {
    return false
  }
}

// Get all configured stock tokens
export function getAllStockTokens() {
  return Object.values(TOKEN_CONFIG.STOCKS).filter(token => 
    isValidTokenAddress(token.mint)
  )
}

// Get token config by symbol
export function getTokenBySymbol(symbol) {
  if (symbol === 'STONKS') {
    return TOKEN_CONFIG.STONKS
  }
  return TOKEN_CONFIG.STOCKS[symbol.toUpperCase()]
}

// Format token amount for display
export function formatTokenAmount(amount, decimals = 9) {
  const divisor = Math.pow(10, decimals)
  const formatted = (amount / divisor).toFixed(6)
  return parseFloat(formatted).toString()
}

// Convert display amount to token amount
export function parseTokenAmount(displayAmount, decimals = 9) {
  const multiplier = Math.pow(10, decimals)
  return Math.floor(parseFloat(displayAmount) * multiplier)
}

// Check token configuration on app startup
export function checkTokenConfiguration() {
  const validation = validateTokenConfig()
  
  if (!validation.isValid) {
    console.warn('⚠️ Token configuration issues found:')
    validation.issues.forEach(issue => console.warn(`  - ${issue}`))
    console.warn('ℹ️ Some features may not work until tokens are configured')
  } else {
    console.log('✅ All tokens configured successfully')
  }
  
  return validation
}

// Development helper to log current configuration
export function logTokenConfiguration() {
  console.log('🪙 Token Configuration:')
  console.log('STONKS:', TOKEN_CONFIG.STONKS.mint || 'NOT CONFIGURED')
  
  Object.entries(TOKEN_CONFIG.STOCKS).forEach(([symbol, config]) => {
    console.log(`${symbol}:`, config.mint || 'NOT CONFIGURED')
  })
} 
