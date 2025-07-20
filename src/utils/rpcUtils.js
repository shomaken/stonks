// RPC Utilities for better error handling and retry logic

/**
 * Execute an RPC call with retry logic and timeout
 * @param {Function} rpcCall - The RPC function to execute
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} timeout - Timeout in milliseconds (default: 10000)
 * @returns {Promise} - The RPC call result
 */
export const executeRpcWithRetry = async (rpcCall, maxRetries = 3, timeout = 15000) => {
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
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000)
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
    return '🔄 RPC is busy. Please wait a moment and try again.'
  } else if (error.message?.includes('403') || error.message?.includes('Access forbidden')) {
    return '🚫 RPC access denied. Please refresh the page and try again.'
  } else if (error.message?.includes('Network error') || error.message?.includes('connection')) {
    return '🌐 Network connection issue. Please check your internet and try again.'
  } else if (error.message?.includes('Failed to fetch')) {
    return '🌐 Network request failed. Please check your connection and try again.'
  }
  
  return error.message || 'RPC error occurred. Please try again.'
}

/**
 * Test RPC endpoint health
 * @param {string} endpoint - The RPC endpoint to test
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 * @returns {Promise<boolean>} - Whether the endpoint is healthy
 */
export const testRpcHealth = async (endpoint, timeout = 5000) => {
  try {
    const response = await Promise.race([
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getHealth',
        }),
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Health check timeout')), timeout)
      )
    ])
    
    return response.ok
  } catch (error) {
    console.warn(`❌ RPC health check failed for ${endpoint}:`, error.message)
    return false
  }
}

/**
 * Get the best available RPC endpoint from a list
 * @param {string[]} endpoints - List of RPC endpoints to test
 * @returns {Promise<string>} - The first healthy endpoint
 */
export const getBestRpcEndpoint = async (endpoints) => {
  for (const endpoint of endpoints) {
    console.log(`🔍 Testing RPC endpoint: ${endpoint}`)
    const isHealthy = await testRpcHealth(endpoint)
    if (isHealthy) {
      console.log(`✅ RPC endpoint healthy: ${endpoint}`)
      return endpoint
    }
  }
  
  console.warn('⚠️ No healthy RPC endpoints found, using first endpoint')
  return endpoints[0]
}
