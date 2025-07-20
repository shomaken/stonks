// Script to create the $STONKS token on Solana
// Run with: node src/scripts/createToken.js

import { 
  Connection, 
  Keypair, 
  Transaction,
  sendAndConfirmTransaction,
  clusterApiUrl
} from '@solana/web3.js'

import {
  createMint,
  createAccount,
  mintTo,
  getMint,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token'

// Configuration
const NETWORK = 'mainnet-beta' // or 'devnet' for testing
const INITIAL_SUPPLY = 1_000_000_000 // 1 billion tokens
const DECIMALS = 9

async function createStonksToken() {
  console.log('🪙 Creating $STONKS Token...\n')
  
  try {
    // Connect to Solana
    const connection = new Connection(
      process.env.VITE_SOLANA_RPC_URL || clusterApiUrl(NETWORK),
      'confirmed'
    )
    
    // Load your wallet (you need to provide the private key)
    const payer = Keypair.fromSecretKey(
      // Replace with your wallet's secret key
      new Uint8Array(JSON.parse(process.env.WALLET_PRIVATE_KEY))
    )
    
    console.log('👛 Wallet Address:', payer.publicKey.toString())
    console.log('🌐 Network:', NETWORK)
    console.log('🔗 RPC:', connection.rpcEndpoint)
    
    // Check wallet balance
    const balance = await connection.getBalance(payer.publicKey)
    console.log('💰 Wallet Balance:', balance / 1e9, 'SOL')
    
    if (balance < 0.01 * 1e9) {
      throw new Error('Insufficient SOL balance. Need at least 0.01 SOL for token creation.')
    }
    
    console.log('\n📝 Creating token mint...')
    
    // Create the token mint
    const mint = await createMint(
      connection,
      payer,           // Fee payer
      payer.publicKey, // Mint authority
      payer.publicKey, // Freeze authority (optional)
      DECIMALS,        // Decimals
      TOKEN_PROGRAM_ID
    )
    
    console.log('✅ Token Mint Created:', mint.toString())
    
    // Create token account for the owner
    console.log('\n💳 Creating token account...')
    const tokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey
    )
    
    console.log('✅ Token Account Created:', tokenAccount.toString())
    
    // Mint initial supply
    console.log(`\n🏭 Minting initial supply of ${INITIAL_SUPPLY.toLocaleString()} tokens...`)
    await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      payer.publicKey,
      INITIAL_SUPPLY * Math.pow(10, DECIMALS)
    )
    
    console.log('✅ Initial supply minted!')
    
    // Get mint info
    const mintInfo = await getMint(connection, mint)
    console.log('\n📊 Token Details:')
    console.log('  Mint Address:', mint.toString())
    console.log('  Decimals:', mintInfo.decimals)
    console.log('  Total Supply:', Number(mintInfo.supply) / Math.pow(10, DECIMALS))
    console.log('  Mint Authority:', mintInfo.mintAuthority?.toString())
    
    console.log('\n🎉 $STONKS Token Successfully Created!')
    console.log('\n📋 Add this to your .env file:')
    console.log(`VITE_STONKS_MINT=${mint.toString()}`)
    
    return {
      mint: mint.toString(),
      tokenAccount: tokenAccount.toString(),
      supply: INITIAL_SUPPLY
    }
    
  } catch (error) {
    console.error('❌ Failed to create token:', error)
    throw error
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  createStonksToken()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { createStonksToken } 