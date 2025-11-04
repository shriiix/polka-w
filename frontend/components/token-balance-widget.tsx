"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  Wallet, 
  TrendingUp, 
  RefreshCw, 
  ExternalLink,
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react"
import { usePolkadotWallet } from "@/contexts/polkadot-wallet-context"
import { 
  TEST_TOKENS, 
  FAUCET_URLS,
  getAllTokenBalances,
  calculatePortfolioValue,
  formatTokenAmount,
  type TestToken 
} from "@/lib/test-tokens"

export function TokenBalanceWidget() {
  const { account, isConnected } = usePolkadotWallet()
  const [tokens, setTokens] = useState<TestToken[]>(TEST_TOKENS)
  const [isLoading, setIsLoading] = useState(false)
  const [showBalances, setShowBalances] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isConnected && account) {
      loadTokenBalances()
    }
  }, [isConnected, account])

  const loadTokenBalances = async () => {
    if (!account) return
    
    setIsLoading(true)
    try {
      const balances = await getAllTokenBalances(account.address)
      setTokens(balances)
    } catch (error) {
      console.error('Error loading token balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const totalValue = calculatePortfolioValue(tokens)

  if (!isConnected || !account) {
    return (
      <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Wallet className="h-5 w-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold dark:text-white text-gray-900">Wallet</h3>
            <p className="text-sm text-gray-400">Not connected</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Connect your wallet to view token balances
        </p>
      </Card>
    )
  }

  return (
    <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold dark:text-white text-gray-900">Portfolio</h3>
            <p className="text-sm text-gray-400">Test tokens</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalances(!showBalances)}
            title={showBalances ? "Hide balances" : "Show balances"}
          >
            {showBalances ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadTokenBalances}
            disabled={isLoading}
            title="Refresh balances"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Total Value */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-purple-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Total Value</span>
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <TrendingUp className="h-3 w-3" />
            <span>+5.2%</span>
          </div>
        </div>
        <div className="text-3xl font-bold dark:text-white text-gray-900">
          {showBalances ? totalValue : '•••••'}
        </div>
      </div>

      {/* Address */}
      <div className="mb-6 p-3 rounded-lg bg-gray-900/50 border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-gray-400 block mb-1">Address</span>
            <span className="text-xs font-mono dark:text-white text-gray-900 break-all">
              {account.address}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAddress}
            className="h-8 w-8 ml-2 flex-shrink-0"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Token List */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold dark:text-white text-gray-900">Assets</span>
          <span className="text-xs text-gray-400">{tokens.length} tokens</span>
        </div>

        {tokens.map((token, index) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-900/30 hover:bg-gray-900/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{token.icon}</div>
              <div>
                <div className="font-semibold dark:text-white text-gray-900 text-sm">
                  {token.symbol}
                </div>
                <div className="text-xs text-gray-400">{token.chain}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold dark:text-white text-gray-900 text-sm">
                {showBalances ? formatTokenAmount(token.balance, token.decimals) : '•••'}
              </div>
              <div className="text-xs text-gray-400">
                {showBalances ? token.value : '•••'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Faucet Links */}
      <div className="border-t border-gray-800 pt-4">
        <div className="text-xs text-gray-400 mb-3">Need test tokens?</div>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={FAUCET_URLS.WESTEND}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors text-sm"
          >
            <span>Westend Faucet</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={FAUCET_URLS.ROCOCO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors text-sm"
          >
            <span>Rococo Faucet</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </Card>
  )
}
