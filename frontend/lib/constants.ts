// Network and API constants
export const POLKADOT_RPC_URL = process.env.NEXT_PUBLIC_POLKADOT_RPC_URL || "wss://rpc.polkadot.io"
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/"
export const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL || "https://api.pinata.cloud"

// Smart Contract Configuration
// Deploy your contract and update these values
export const CONTRACT_CONFIG = {
  // Canvas Testnet (default for development)
  CANVAS: {
    RPC_URL: "wss://canvas-rpc.parity.io",
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CANVAS_CONTRACT_ADDRESS || "",
    NETWORK_NAME: "Canvas Testnet",
  },
  // Westend Contracts Testnet
  WESTEND: {
    RPC_URL: "wss://westend-contracts-rpc.polkadot.io",
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_WESTEND_CONTRACT_ADDRESS || "",
    NETWORK_NAME: "Westend Contracts",
  },
  // Astar Network (Production)
  ASTAR: {
    RPC_URL: "wss://rpc.astar.network",
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_ASTAR_CONTRACT_ADDRESS || "",
    NETWORK_NAME: "Astar Network",
  },
  // Local Development Node
  LOCAL: {
    RPC_URL: "ws://127.0.0.1:9944",
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS || "",
    NETWORK_NAME: "Local Node",
  },
}

// Active network (change this to switch networks)
export const ACTIVE_NETWORK = process.env.NEXT_PUBLIC_NETWORK || "CANVAS"
export const ACTIVE_CONTRACT_CONFIG = CONTRACT_CONFIG[ACTIVE_NETWORK as keyof typeof CONTRACT_CONFIG]

// File size limits
export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const CHUNK_SIZE = 1024 * 1024 // 1MB chunks

// Encryption settings
export const ENCRYPTION_ALGORITHM = "AES-GCM"
export const KEY_LENGTH = 256

// UI Constants
export const TRUNCATE_ADDRESS_LENGTH = 6
