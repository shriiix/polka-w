// Polkadot blockchain utilities
export interface PolkadotAccount {
  address: string
  meta: {
    name?: string
    source: string
  }
  type?: string
}

export interface InjectedAccountWithMeta {
  address: string
  meta: {
    name?: string
    source: string
    genesisHash?: string
  }
  type?: string
}

declare global {
  interface Window {
    injectedWeb3?: {
      [key: string]: {
        enable: (origin: string) => Promise<any>
        version: string
      }
    }
  }
}

export async function getInjectedExtensions(): Promise<string[]> {
  if (typeof window === "undefined" || !window.injectedWeb3) {
    return []
  }
  return Object.keys(window.injectedWeb3)
}

export async function connectWallet(extensionName?: string): Promise<PolkadotAccount[] | null> {
  try {
    // Check if running in browser
    if (typeof window === "undefined") {
      throw new Error("Not in browser environment")
    }

    // Check for injected extensions
    const extensions = await getInjectedExtensions()
    
    if (extensions.length === 0) {
      // If no extension found, use mock wallet for localhost development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('No wallet extension found. Using mock wallet for development.')
        return [{
          address: '5FgkxCkMg7jB3hB9p2XeAqtM1yShdtXUZSsMYz89mQbtNQ4H',
          meta: {
            name: 'Development Account',
            source: 'mock-wallet',
          },
          type: 'sr25519',
        }]
      }
      throw new Error("No Polkadot wallet extension found. Please install SubWallet, Polkadot.js, or Talisman.")
    }

    // Auto-detect best available wallet if not specified
    // Priority: SubWallet > Polkadot.js > Talisman > any other
    let selectedExtension = extensionName
    
    if (!selectedExtension) {
      if (extensions.includes('subwallet-js')) {
        selectedExtension = 'subwallet-js'
      } else if (extensions.includes('polkadot-js')) {
        selectedExtension = 'polkadot-js'
      } else if (extensions.includes('talisman')) {
        selectedExtension = 'talisman'
      } else {
        selectedExtension = extensions[0]
      }
    }

    // Try to get the extension
    const injectedExtension = window.injectedWeb3?.[selectedExtension]
    
    if (!injectedExtension) {
      throw new Error(`${selectedExtension} extension not found`)
    }

    try {
      // Enable the extension with proper origin
      const injected = await injectedExtension.enable('ChainVault')
      
      // Get accounts
      const accounts = await injected.accounts.get()
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in wallet")
      }

      return accounts.map((account: InjectedAccountWithMeta) => ({
        address: account.address,
        meta: {
          name: account.meta.name || 'Account',
          source: account.meta.source,
        },
        type: account.type,
      }))
    } catch (error: any) {
      // If extension blocks localhost, automatically use mock wallet
      if (error.message?.includes('not allowed') || error.message?.includes('denied') || 
          error.message?.includes('blocked') || error.message?.includes('rejected')) {
        
        // Check if on localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          console.warn('⚠️ Extension blocked connection. Using mock wallet for development.')
          console.info('💡 To use real extension: Right-click extension icon → Manage Extension → Site Access → Allow on all sites')
          
          return [{
            address: '5FgkxCkMg7jB3hB9p2XeAqtM1yShdtXUZSsMYz89mQbtNQ4H',
            meta: {
              name: 'Development Account (Mock)',
              source: 'mock-wallet',
            },
            type: 'sr25519',
          }]
        }
      }
      throw error
    }
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

export async function disconnectWallet(): Promise<void> {
  // Clear wallet connection from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem('polkadot_account')
    localStorage.removeItem('polkadot_connected')
  }
  return Promise.resolve()
}

export async function signMessage(message: string, address: string): Promise<string> {
  try {
    if (typeof window === "undefined" || !window.injectedWeb3) {
      throw new Error("No wallet extension found")
    }

    const extensions = await getInjectedExtensions()
    if (extensions.length === 0) {
      throw new Error("No wallet extension found")
    }

    const injectedExtension = window.injectedWeb3[extensions[0]]
    const injected = await injectedExtension.enable('ChainVault')
    
    // Sign the message
    const signRaw = injected?.signer?.signRaw
    
    if (!signRaw) {
      throw new Error("Signer not available")
    }

    const { signature } = await signRaw({
      address,
      data: message,
      type: 'bytes'
    })

    return signature
  } catch (error) {
    console.error("Error signing message:", error)
    throw error
  }
}

export async function signTransaction(data: string, address: string): Promise<string> {
  // For now, use signMessage as a fallback
  return signMessage(data, address)
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}
