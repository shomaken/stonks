import React from 'react'
import { motion } from 'framer-motion'

function Info() {
  const features = [
    {
      icon: "🎉",
      title: "Meme Magic Meets Markets",
      description: "Ride the viral stonks craze straight into on‑chain trading fun."
    },
    {
      icon: "🌐",
      title: "First‑Ever Tradable Meme",
      description: "Put your $ST0NKS to work—you're not just HODLing, you're investing."
    },
    {
      icon: "⚡",
      title: "Instant Ownership",
      description: "Swap on‑chain and hold your favorite stock tokens in your wallet instantly."
    },
    {
      icon: "🔄",
      title: "Peer‑to‑Peer Swaps",
      description: "One‑click trades—no middlemen, no delays."
    }
  ]

  const swapSteps = [
    { step: "1", action: "Connect Wallet", icon: "🔌" },
    { step: "2", action: "Select Stock Token", icon: "📊" },
    { step: "3", action: "Swap $ST0NKS ⟷ Stock", icon: "⚡" },
    { step: "4", action: "Hold & Profit", icon: "💎" }
  ]

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-transparent" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              🚀 Why{' '}
              <span className="text-stonks-green bg-gradient-to-r from-stonks-green to-green-400 bg-clip-text text-transparent">
                St0nks?
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-300 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              St0nks isn't just a meme—it's the first meme token you can actually use to buy and sell real stock‑pegged SPL tokens. Here's what makes it legendary:
            </motion.p>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-stonks-green/20 to-green-600/20 border border-stonks-green/30 rounded-lg flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>


          </motion.div>

          {/* Right Column - Animated Swap Flow */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full max-w-md">
              
              {/* Swap flow container */}
              <div className="glass-effect p-8 text-center">
                <h3 className="font-heading text-2xl font-semibold text-white mb-8">
                  🔧 How It Works
                </h3>
                
                {/* Swap steps */}
                <div className="space-y-6">
                  {swapSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.5 + index * 0.2,
                        type: "spring",
                        stiffness: 200 
                      }}
                    >
                      {/* Step number */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-stonks-green to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 text-left">
                        <div className="text-white font-semibold">{step.action}</div>
                        <div className="text-gray-400 text-sm">
                          {step.step === "1" && "🔌 Connect Wallet"}
                          {step.step === "2" && "📊 Select Stock Token"}
                          {step.step === "3" && "⚡ Swap $ST0NKS ⟷ Stock"}
                          {step.step === "4" && "💎 Hold & Profit"}
                        </div>
                      </div>
                      
                      {/* Step icon */}
                      <div className="text-2xl">{step.icon}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Animated arrow between steps */}
                <div className="absolute right-4 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-stonks-green to-transparent opacity-50" />
                
                {/* Floating animation elements */}
                <motion.div
                  className="absolute -top-4 -right-4 text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ✨
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 text-xl"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  🎯
                </motion.div>
              </div>

              {/* Orbiting elements */}
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-stonks-green/30 rounded-full flex items-center justify-center bg-navy/80 backdrop-blur-sm"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className="text-2xl">$</span>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 border-2 border-stonks-green/30 rounded-full flex items-center justify-center bg-navy/80 backdrop-blur-sm"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <span className="text-2xl">📈</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Tokenomics Section */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.h3 
              className="font-heading text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              💎 Tokenomics
            </motion.h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 80% Locked Supply */}
            <motion.div
              className="relative bg-gradient-to-br from-navy/80 to-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-stonks-green/20 hover:border-stonks-green/40 transition-all duration-300 group"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-stonks-green/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-stonks-green/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-white">80% Supply Locked</h4>
                    <p className="text-gray-300 text-sm">1 Month Lock Period</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <motion.div 
                    className="bg-gradient-to-r from-stonks-green to-green-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "80%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stonks-green font-semibold">80%</p>
                  <motion.button
                    className="bg-gradient-to-r from-stonks-green to-green-400 text-navy font-semibold py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-stonks-green/25 transition-all duration-300 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('https://solscan.io/token/CwMm1x28qoStmYnsLkRFqQfiQEyBTvKVJjcaSkc2bonk', '_blank')}
                  >
                    🔍 Check Locked Supply
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* 20% Circulating Supply */}
            <motion.div
              className="relative bg-gradient-to-br from-navy/80 to-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-stonks-green/20 hover:border-stonks-green/40 transition-all duration-300 group"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl">💧</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-xl font-bold text-white">20% Circulating</h4>
                    <p className="text-gray-300 text-sm">Available on Raydium</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "20%" }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
                <p className="text-right text-blue-400 font-semibold">20%</p>
              </div>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Secure tokenomics designed for stability and growth. 
              <span className="text-stonks-green font-semibold"> Trade responsibly.</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          className="mt-20 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <motion.h3 
              className="font-heading text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              🤝 Our Partners
            </motion.h3>
            <motion.p 
              className="text-gray-300 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trusted by leading organizations in the Solana ecosystem
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Solana Partner */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-gradient-to-br from-navy/80 to-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-stonks-green/20 hover:border-stonks-green/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-stonks-green/10">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center h-48">
                  <img 
                    src="/src/assets/solana-partner.png" 
                    alt="Solana Foundation" 
                    className="h-40 w-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* Wintermute Partner */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-gradient-to-br from-navy/80 to-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-stonks-green/20 hover:border-stonks-green/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-stonks-green/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center h-48">
                  <img 
                    src="/src/assets/wintermute-partner.png" 
                    alt="Wintermute Partner" 
                    className="h-60 w-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* LetsBONK Partner */}
            <motion.div
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-gradient-to-br from-navy/80 to-navy/60 backdrop-blur-sm rounded-2xl p-8 border border-stonks-green/20 hover:border-stonks-green/40 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-stonks-green/10">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center h-48">
                  <img 
                    src="/src/assets/letsbonk-partner.png" 
                    alt="LetsBONK Partner" 
                    className="h-60 w-auto object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Message */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-300 text-lg">
              Building the future of decentralized finance together
              <span className="text-stonks-green font-semibold"> on Solana</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Info 
