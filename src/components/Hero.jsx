import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import logo from '../assets/logo.png'
import stonksGuy from '../assets/standing-stonksguy.png'
import WalletDashboard from './WalletDashboard'

function Hero() {
  const { connected } = useWallet()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 50,
      y: (clientY / innerHeight - 0.5) * 50,
    })
  }

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, #3FBF3F 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, #3FBF3F 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, #3FBF3F 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, #3FBF3F 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen py-20">
          
          {/* Left side - Text content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              transform: `translate3d(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px, 0)`,
            }}
          >
            {/* Logo */}
            <motion.div
              className="mb-6 flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <img 
                src={logo} 
                alt="STONKS Logo" 
                className="h-16 md:h-20 lg:h-24 object-contain"
              />
            </motion.div>

            {/* Main headline */}
            <motion.h1 
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Trade Real{' '}
              <span className="text-stonks-green bg-gradient-to-r from-stonks-green to-green-400 bg-clip-text text-transparent animate-glow">
                Stocks
              </span>
              <br />
              with{' '}
              <span className="text-stonks-green font-black">$STONKS</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Connect wallet to start trade stocks on-chain with $st0nks
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {/* Custom styled wallet connect button */}
              <div className="wallet-button-container">
                <WalletMultiButton className="btn-3d !bg-stonks-green hover:!bg-green-500 !border-none !rounded-lg !font-heading !font-bold !text-lg !px-8 !py-4 !transition-all !duration-300" />
              </div>

              {/* Buy STONKS button */}
              <motion.a
                href="https://dexscreener.com/solana/CwMm1x28qoStmYnsLkRFqQfiQEyBTvKVJjcaSkc2bonk"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d bg-gradient-to-r from-stonks-green to-green-600 hover:from-green-400 hover:to-green-500 border-stonks-green hover:border-green-400 text-white font-heading font-bold text-lg px-8 py-4 transition-all duration-300 text-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Buy $STONKS
              </motion.a>

              {connected && (
                <motion.button
                  className="btn-3d bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    document.getElementById('dashboard').scrollIntoView({ 
                      behavior: 'smooth' 
                    })
                  }}
                >
                  Start Trading
                </motion.button>
              )}
            </motion.div>

            {/* Wallet Dashboard */}
            {connected && (
              <motion.div 
                className="mt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <WalletDashboard />
              </motion.div>
            )}


          </motion.div>

          {/* Right side - Stonks Guy character */}
          <motion.div 
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              transform: `translate3d(${mousePosition.x * -0.05}px, ${mousePosition.y * -0.05}px, 0)`,
            }}
          >
            <div className="relative">
              {/* Glow effect behind character */}
              <motion.div
                className="absolute inset-0 bg-gradient-radial from-stonks-green/30 to-transparent rounded-full blur-3xl scale-150"
                animate={{
                  scale: [1.2, 1.5, 1.2],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* STONKS Guy Character */}
              <motion.div
                className="relative z-10 w-80 h-80 md:w-96 md:h-96 flex items-center justify-center"
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img 
                  src={stonksGuy} 
                  alt="STONKS Guy Character" 
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </motion.div>

              {/* Subtle floating elements around character */}
              <motion.div
                className="absolute -top-8 -right-8 text-2xl opacity-60"
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                📈
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 text-xl opacity-60"
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, -8, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
              >
                🚀
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-stonks-green rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-stonks-green rounded-full mt-2"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero 
