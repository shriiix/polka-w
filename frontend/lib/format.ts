// Format file size to human readable
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

// Format date to relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString()
}

// Truncate wallet address
export function truncateAddress(address: string, length = 6): string {
  if (!address) return ""
  if (address.length <= length * 2) return address

  return `${address.slice(0, length)}...${address.slice(-length)}`
}

// Format CID for display
export function formatCID(cid: string, length = 8): string {
  if (!cid) return ""
  if (cid.length <= length * 2) return cid

  return `${cid.slice(0, length)}...${cid.slice(-length)}`
}
