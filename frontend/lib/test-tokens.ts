// Test tokens configuration for development
export interface TestToken {
  symbol: string
  name: string
  decimals: number
  balance: string
  icon: string
  chain: string
  value?: string // USD value
}

export const TEST_TOKENS: TestToken[] = [
  {
    symbol: 'DOT',
    name: 'Polkadot',
    decimals: 10,
    balance: '125.5',
    icon: '🔵',
    chain: 'Polkadot',
    value: '$950.00'
  },
  {
    symbol: 'KSM',
    name: 'Kusama',
    decimals: 12,
    balance: '48.25',
    icon: '⚫',
    chain: 'Kusama',
    value: '$385.00'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    balance: '1000.00',
    icon: '💵',
    chain: 'Polkadot',
    value: '$1,000.00'
  },
  {
    symbol: 'GLMR',
    name: 'Moonbeam',
    decimals: 18,
    balance: '2500.00',
    icon: '🌙',
    chain: 'Moonbeam',
    value: '$625.00'
  },
  {
    symbol: 'ACA',
    name: 'Acala',
    decimals: 12,
    balance: '5000.00',
    icon: '🔴',
    chain: 'Acala',
    value: '$350.00'
  }
]

// Faucet URLs for test tokens
export const FAUCET_URLS = {
  POLKADOT: 'https://faucet.polkadot.io/',
  KUSAMA: 'https://faucet.polkadot.io/kusama',
  WESTEND: 'https://faucet.polkadot.io/westend',
  ROCOCO: 'https://faucet.polkadot.io/rococo'
}

// Test networks
export const TEST_NETWORKS = [
  {
    name: 'Westend',
    symbol: 'WND',
    rpc: 'wss://westend-rpc.polkadot.io',
    faucet: FAUCET_URLS.WESTEND,
    explorer: 'https://westend.subscan.io/'
  },
  {
    name: 'Rococo',
    symbol: 'ROC',
    rpc: 'wss://rococo-rpc.polkadot.io',
    faucet: FAUCET_URLS.ROCOCO,
    explorer: 'https://rococo.subscan.io/'
  }
]

// Mock function to get token balance
export async function getTokenBalance(address: string, token: string): Promise<string> {
  // In production, this would query the blockchain
  // For now, return test data
  const tokenData = TEST_TOKENS.find(t => t.symbol === token)
  return tokenData?.balance || '0'
}

// Mock function to get all token balances
export async function getAllTokenBalances(address: string): Promise<TestToken[]> {
  // In production, this would query multiple chains
  // For now, return test data with some randomization
  return TEST_TOKENS.map(token => ({
    ...token,
    balance: (parseFloat(token.balance) * (0.9 + Math.random() * 0.2)).toFixed(2)
  }))
}

// Calculate total portfolio value
export function calculatePortfolioValue(tokens: TestToken[]): string {
  const total = tokens.reduce((sum, token) => {
    const value = parseFloat(token.value?.replace(/[$,]/g, '') || '0')
    return sum + value
  }, 0)
  return `$${total.toFixed(2)}`
}

// Format token amount
export function formatTokenAmount(amount: string, decimals: number, maxDecimals: number = 4): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return '0'
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)}K`
  } else {
    return num.toFixed(Math.min(maxDecimals, decimals))
  }
}
