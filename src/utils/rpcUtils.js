// RPC Utilities for better error handling and retry logic

/**
 * Execute an RPC call with retry logic and timeout
 * @param {Function} rpcCall - The RPC function to execute
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise} - The RPC call result
 */
export const executeRpcWithRetry = async (rpcCall, maxRetries = 3, timeout = 10000) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 RPC attempt ${attempt}/${maxRetries}`)
      
      // Execute with timeout
      const result = await Promise.race([
        rpcCall(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RPC timeout')), timeout)
        )
      ])
      
      console.log(`✅ RPC call successful on attempt ${attempt}`)
      return result
      
    } catch (error) {
      lastError = error
      console.warn(`❌ RPC attempt ${attempt} failed:`, error.message)
      
      // Don't retry on certain errors
      if (error.message?.includes('Insufficient') || 
          error.message?.includes('No tokens found') ||
          error.message?.includes('User rejected')) {
        throw error
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  // All retries failed
  console.error(`❌ All ${maxRetries} RPC attempts failed`)
  throw new Error(`RPC failed after ${maxRetries} attempts: ${lastError.message}`)
}

/**
 * Check if an error is a retryable RPC error
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether the error is retryable
 */
export const isRetryableRpcError = (error) => {
  const retryableErrors = [
    'RPC timeout',
    'Failed to fetch',
    'timeout',
    'Network error',
    'connection',
    'ECONNRESET',
    'ENOTFOUND'
  ]
  
  return retryableErrors.some(keyword => 
    error.message?.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * Get user-friendly error message for RPC errors
 * @param {Error} error - The RPC error
 * @returns {string} - User-friendly error message
 */
export const getRpcErrorMessage = (error) => {
  if (error.message?.includes('RPC timeout') || error.message?.includes('timeout')) {
    return '🔄 Jupiter RPC is busy. Please wait a moment and try again.'
  } else if (error.message?.includes('403') || error.message?.includes('Access forbidden')) {
    return '🚫 RPC access denied. Please refresh the page and try again.'
  } else if (error.message?.includes('Network error') || error.message?.includes('connection')) {
    return '🌐 Network connection issue. Please check your internet and try again.'
  } else if (error.message?.includes('Failed to fetch')) {
    return '🌐 Network request failed. Please check your connection and try again.'
  }
  
  return error.message || 'RPC error occurred. Please try again.'
} 