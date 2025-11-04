"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { 
  connectWallet, 
  disconnectWallet, 
  getInjectedExtensions,
  type PolkadotAccount,
  shortenAddress
} from "@/lib/polkadot"

interface PolkadotWalletContextType {
  account: PolkadotAccount | null
  accounts: PolkadotAccount[]
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  selectAccount: (address: string) => void
  hasExtension: boolean
}

const PolkadotWalletContext = createContext<PolkadotWalletContextType | undefined>(undefined)

export function PolkadotWalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PolkadotAccount | null>(null)
  const [accounts, setAccounts] = useState<PolkadotAccount[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasExtension, setHasExtension] = useState(false)

  useEffect(() => {
    // Check if wallet extension is available
    const checkExtension = async () => {
      const extensions = await getInjectedExtensions()
      setHasExtension(extensions.length > 0)
    }
    checkExtension()

    // Check if already connected
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('polkadot_account')
      const isConnectedFlag = localStorage.getItem('polkadot_connected')
      
      if (savedAddress && isConnectedFlag === 'true') {
        try {
          const accounts = await connectWallet()
          if (accounts && accounts.length > 0) {
            const savedAccount = accounts.find(acc => acc.address === savedAddress)
            if (savedAccount) {
              setAccount(savedAccount)
              setAccounts(accounts)
              setIsConnected(true)
            }
          }
        } catch (error) {
          console.error("Error restoring connection:", error)
          localStorage.removeItem('polkadot_account')
          localStorage.removeItem('polkadot_connected')
        }
      }
    }
    
    if (typeof window !== "undefined") {
      checkConnection()
    }
  }, [])

  const connect = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      const extensions = await getInjectedExtensions()
      
      // Allow connection even without extensions (will use mock wallet)
      const connectedAccounts = await connectWallet()
      
      if (!connectedAccounts || connectedAccounts.length === 0) {
        throw new Error("No accounts available")
      }

      setAccounts(connectedAccounts)
      setAccount(connectedAccounts[0])
      setIsConnected(true)
      
      // Save to localStorage
      localStorage.setItem('polkadot_account', connectedAccounts[0].address)
      localStorage.setItem('polkadot_connected', 'true')
      
      // Check if using mock wallet
      if (connectedAccounts[0].meta.source === 'mock-wallet') {
        console.log('✅ Connected with development mock wallet')
      }
      
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      setError(error.message || "Failed to connect wallet")
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    disconnectWallet()
    setAccount(null)
    setAccounts([])
    setIsConnected(false)
    setError(null)
  }

  const selectAccount = (address: string) => {
    const selectedAccount = accounts.find(acc => acc.address === address)
    if (selectedAccount) {
      setAccount(selectedAccount)
      localStorage.setItem('polkadot_account', address)
    }
  }

  return (
    <PolkadotWalletContext.Provider 
      value={{ 
        account, 
        accounts,
        isConnected, 
        isConnecting,
        error,
        connect, 
        disconnect,
        selectAccount,
        hasExtension
      }}
    >
      {children}
    </PolkadotWalletContext.Provider>
  )
}

export function usePolkadotWallet() {
  const context = useContext(PolkadotWalletContext)
  if (context === undefined) {
    throw new Error("usePolkadotWallet must be used within a PolkadotWalletProvider")
  }
  return context
}
