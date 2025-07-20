import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
    { name: 'Discord', icon: '💬', url: 'https://discord.com' },
    { name: 'GitHub', icon: '⚡', url: 'https://github.com' },
  ]

  return (
    <footer className="relative py-12 px-6 bg-navy/80 backdrop-blur-sm border-t border-gray-800/50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent opacity-50" />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          
          {/* Left side - Branding */}
          <motion.div 
            className="flex items-center space-x-4 mb-6 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-stonks-green to-green-600 rounded-xl flex items-center justify-center text-2xl">
              📈
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white">Stonks</h3>
              <p className="text-sm text-gray-400">Trade Real Stocks</p>
            </div>
          </motion.div>

          {/* Center - Attribution */}
          <motion.div 
            className="text-center mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-gray-300 font-medium">
              This Website is made
              <motion.span
                className="text-red-500 text-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              >
                
              </motion.span>
              {' '}by{' '}
              <a 
                href="https://x.com/brooz22" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stonks-green font-bold hover:text-green-400 transition-colors duration-300"
              >
                Brooz
              </a>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              © {currentYear} Stonks. No financial advice.
            </p>
          </motion.div>

          {/* Right side - Social Links */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800/50 hover:bg-stonks-green/20 border border-gray-700 hover:border-stonks-green/50 rounded-lg flex items-center justify-center text-lg transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                title={link.name}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="mt-8 pt-8 border-t border-gray-800/50 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <span>Built on Solana</span>
            <span>•</span>
            <span>Powered by Jupiter</span>
            <span>•</span>
            <span>Diamond Hands Only 💎🙌</span>
          </div>
          
          {/* Disclaimer */}
          <motion.div 
            className="mt-4 max-w-2xl mx-auto text-xs text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <p>
              Not financial advice. Trading involves risk. 
              Past performance does not guarantee future results. Always DYOR.
            </p>
          </motion.div>
        </motion.div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-stonks-green/30 rounded-full"
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer 
