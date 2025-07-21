import React from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const WalletConnectionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const modalContent = (
    <div className="wallet-modal-overlay">
      <AnimatePresence>
        <motion.div
          className="wallet-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        
        <div className="wallet-modal-container">
          <motion.div
            className="wallet-modal-content"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="wallet-modal-close"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <div className="wallet-modal-header">
              <div className="wallet-modal-icon">🔐</div>
              <h2 className="wallet-modal-title">Connect Your Wallet</h2>
              <p className="wallet-modal-subtitle">
                Connect your wallet to start trading $STONKS for stock tokens
              </p>
            </div>

            {/* Wallet button */}
            <div className="wallet-modal-button-container">
              <WalletMultiButton className="wallet-modal-button" />
            </div>

            {/* Footer */}
            <div className="wallet-modal-footer">
              <p className="wallet-modal-security">
                🔒 Secure connection • Your keys, your coins
              </p>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default WalletConnectionModal 
