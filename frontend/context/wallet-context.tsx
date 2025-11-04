"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { connectWallet, disconnectWallet, type PolkadotAccount } from "@/lib/polkadot"
import { useToast } from "@/hooks/use-toast"

interface WalletContextType {
  account: PolkadotAccount | null
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PolkadotAccount | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const connect = async () => {
    setIsConnecting(true)
    try {
      const connectedAccount = await connectWallet()
      if (connectedAccount) {
        setAccount(connectedAccount)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${connectedAccount.meta.name || "wallet"}`,
        })
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = async () => {
    try {
      await disconnectWallet()
      setAccount(null)
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect wallet.",
        variant: "destructive",
      })
    }
  }

  return (
    <WalletContext.Provider value={{ account, isConnecting, connect, disconnect }}>{children}</WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
