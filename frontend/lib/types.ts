export interface StoredFile {
  id: string
  name: string
  size: number
  type: string
  cid: string
  encrypted: boolean
  uploadedAt: Date
  sharedWith: string[]
  tags: string[]
}

export interface ShareLink {
  id: string
  fileId: string
  fileName: string
  expiresAt?: Date
  accessCount: number
  maxAccess?: number
  password?: string
  createdAt: Date
}

export interface ActivityLog {
  id: string
  action: "upload" | "download" | "share" | "delete"
  fileName: string
  timestamp: Date
  details?: string
}
