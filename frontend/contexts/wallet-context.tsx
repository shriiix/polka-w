"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { BrowserProvider, type JsonRpcSigner } from "ethers"

interface WalletContextType {
  address: string | null
  signer: JsonRpcSigner | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new BrowserProvider(window.ethereum)
          const accounts = await provider.listAccounts()
          if (accounts.length > 0) {
            const signer = await provider.getSigner()
            setAddress(accounts[0].address)
            setSigner(signer)
            setIsConnected(true)
          }
        } catch (error) {
          console.error("Error checking connection:", error)
        }
      }
    }
    checkConnection()
  }, [])

  const connect = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask to use this app")
      return
    }

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setAddress(address)
      setSigner(signer)
      setIsConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
    }
  }

  const disconnect = () => {
    setAddress(null)
    setSigner(null)
    setIsConnected(false)
  }

  return (
    <WalletContext.Provider value={{ address, signer, isConnected, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
