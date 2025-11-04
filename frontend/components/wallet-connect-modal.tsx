"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Wallet, AlertCircle, CheckCircle, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { usePolkadotWallet } from "@/contexts/polkadot-wallet-context"
import { shortenAddress } from "@/lib/polkadot"

interface WalletConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function WalletConnectModal({ isOpen, onClose, onSuccess }: WalletConnectModalProps) {
  const { account, accounts, isConnecting, error, connect, selectAccount, hasExtension } = usePolkadotWallet()
  const [showAccounts, setShowAccounts] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    try {
      await connect()
      setShowAccounts(true)
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (error) {
      console.error("Connection failed:", error)
    }
  }

  const handleAccountSelect = (address: string) => {
    selectAccount(address)
    if (onSuccess) {
      setTimeout(() => {
        onSuccess()
      }, 500)
    }
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-md"
          >
            <Card className="dark:bg-gray-950 bg-white border border-gray-800 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white text-gray-900">
                  {showAccounts ? "Select Account" : "Connect Wallet"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              {!showAccounts ? (
                <div className="space-y-4">
                  {/* Extension Check */}
                  {!hasExtension && (
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm text-orange-200 font-semibold">
                          No wallet found - Using mock wallet for development
                        </p>
                        <p className="text-xs text-orange-200">
                          You can still test all features with a development account. For production, install one of these wallets:
                        </p>
                        <div className="space-y-1">
                          <a
                            href="https://www.subwallet.app/download.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
                          >
                            SubWallet (Recommended) <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href="https://polkadot.js.org/extension/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                          >
                            Polkadot.js Extension <ExternalLink className="h-3 w-3" />
                          </a>
                          <a
                            href="https://talisman.xyz/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
                          >
                            Talisman Wallet <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Localhost Warning */}
                  {hasExtension && typeof window !== 'undefined' && 
                   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                    <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-3">
                        <p className="text-sm text-blue-200 font-semibold">
                          Extension Blocking Localhost?
                        </p>
                        <div className="text-xs text-blue-200 space-y-2">
                          <p className="font-semibold">Quick Fix (Easiest):</p>
                          <ol className="list-decimal list-inside space-y-1 ml-2">
                            <li>Right-click the extension icon in toolbar</li>
                            <li>Select "Manage Extension"</li>
                            <li>Change "Site Access" to "On all sites"</li>
                            <li>Refresh this page</li>
                          </ol>
                          <p className="text-blue-300 font-semibold mt-3">
                            Or just click Connect - the app will automatically use a mock wallet with your address for testing! ✨
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-200">{error}</p>
                    </div>
                  )}

                  {/* Info */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Wallet className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white text-gray-900 mb-1">
                          Secure & Decentralized
                        </h3>
                        <p className="text-sm text-gray-400">
                          Connect your Polkadot wallet to access decentralized cloud storage
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white text-gray-900 mb-1">
                          Your Keys, Your Data
                        </h3>
                        <p className="text-sm text-gray-400">
                          We never store your private keys. You maintain full control.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-semibold py-6 rounded-lg gap-2"
                  >
                    {isConnecting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="h-5 w-5" />
                        {hasExtension ? 'Connect Polkadot Wallet' : 'Use Development Wallet'}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500">
                    {hasExtension 
                      ? 'By connecting, you agree to our Terms of Service and Privacy Policy'
                      : 'Development mode - All features available for testing'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Success Message */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm text-green-200">
                      Successfully connected! Select an account to continue.
                    </p>
                  </div>

                  {/* Account List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {accounts.map((acc) => (
                      <button
                        key={acc.address}
                        onClick={() => handleAccountSelect(acc.address)}
                        className={`w-full p-4 rounded-lg border transition-all text-left ${
                          account?.address === acc.address
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-gray-800 hover:border-gray-700 bg-gray-900/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold dark:text-white text-gray-900">
                            {acc.meta.name || "Account"}
                          </span>
                          {account?.address === acc.address && (
                            <CheckCircle className="h-4 w-4 text-purple-500" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400 font-mono">
                            {shortenAddress(acc.address, 6)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyAddress(acc.address)
                            }}
                            className="p-1 hover:bg-gray-800 rounded transition"
                          >
                            {copied ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      if (onSuccess) onSuccess()
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
