#!/usr/bin/env node

/**
 * RPC Endpoint Testing Script
 * Tests various Solana RPC endpoints for connectivity and response time
 */

const endpoints = [
  'https://api.mainnet-beta.solana.com',
  'https://solana.public-rpc.com',
  'https://rpc.ankr.com/solana',
  'https://solana-api.projectserum.com'
]

async function testEndpoint(endpoint, timeout = 10000) {
  const startTime = Date.now()
  
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
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ])
    
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${endpoint}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Response Time: ${responseTime}ms`)
      console.log(`   Health: ${data.result || 'N/A'}`)
      return { success: true, responseTime, endpoint }
    } else {
      console.log(`❌ ${endpoint}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: HTTP ${response.status}`)
      return { success: false, endpoint }
    }
  } catch (error) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    console.log(`❌ ${endpoint}`)
    console.log(`   Error: ${error.message}`)
    console.log(`   Time: ${responseTime}ms`)
    return { success: false, endpoint, error: error.message }
  }
}

async function testAllEndpoints() {
  console.log('🔍 Testing Solana RPC Endpoints...\n')
  
  const results = []
  
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint)
    results.push(result)
    console.log('') // Add spacing between tests
  }
  
  // Summary
  console.log('📊 Summary:')
  const workingEndpoints = results.filter(r => r.success)
  const failedEndpoints = results.filter(r => !r.success)
  
  console.log(`✅ Working: ${workingEndpoints.length}`)
  console.log(`❌ Failed: ${failedEndpoints.length}`)
  
  if (workingEndpoints.length > 0) {
    console.log('\n🏆 Recommended endpoints (fastest first):')
    workingEndpoints
      .sort((a, b) => a.responseTime - b.responseTime)
      .forEach((result, index) => {
        console.log(`${index + 1}. ${result.endpoint} (${result.responseTime}ms)`)
      })
  }
  
  if (failedEndpoints.length > 0) {
    console.log('\n⚠️ Failed endpoints:')
    failedEndpoints.forEach(result => {
      console.log(`- ${result.endpoint}: ${result.error}`)
    })
  }
}

// Run the test
testAllEndpoints().catch(console.error)