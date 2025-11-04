"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { StoredFile, ShareLink, ActivityLog } from "@/lib/types"

interface StorageContextType {
  files: StoredFile[]
  shareLinks: ShareLink[]
  activityLog: ActivityLog[]
  addFile: (file: StoredFile) => void
  removeFile: (id: string) => void
  addShareLink: (link: ShareLink) => void
  removeShareLink: (id: string) => void
  addActivity: (activity: ActivityLog) => void
  getFileById: (id: string) => StoredFile | undefined
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function StorageProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<StoredFile[]>([])
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])

  // Load from localStorage on mount with demo data fallback
  useEffect(() => {
    const savedFiles = localStorage.getItem("web3-storage-files")
    const savedLinks = localStorage.getItem("web3-storage-links")
    const savedActivity = localStorage.getItem("web3-storage-activity")

    if (savedFiles) {
      setFiles(JSON.parse(savedFiles))
    } else {
      // Add demo files on first load
      const demoFiles: StoredFile[] = [
        {
          id: "demo-1",
          name: "Project Whitepaper.pdf",
          size: 2450000,
          type: "application/pdf",
          cid: "QmExampleCID1abc123",
          uploadedAt: new Date(Date.now() - 86400000), // 1 day ago
          encrypted: true,
          sharedWith: [],
          tags: ["important", "docs"]
        },
        {
          id: "demo-2",
          name: "ChainVault Logo.png",
          size: 580000,
          type: "image/png",
          cid: "QmExampleCID2def456",
          uploadedAt: new Date(Date.now() - 172800000), // 2 days ago
          encrypted: false,
          sharedWith: ["5E3C...9F8"],
          tags: ["design", "brand"]
        },
        {
          id: "demo-3",
          name: "Smart Contract Code.sol",
          size: 12500,
          type: "text/plain",
          cid: "QmExampleCID3ghi789",
          uploadedAt: new Date(Date.now() - 259200000), // 3 days ago
          encrypted: true,
          sharedWith: ["1A2B...3C4", "7D8E...9F0"],
          tags: ["code", "blockchain"]
        },
        {
          id: "demo-4",
          name: "Demo Video.mp4",
          size: 15700000,
          type: "video/mp4",
          cid: "QmExampleCID4jkl012",
          uploadedAt: new Date(Date.now() - 345600000), // 4 days ago
          encrypted: false,
          sharedWith: [],
          tags: ["media", "demo"]
        },
      ]
      setFiles(demoFiles)
    }
    
    if (savedLinks) setShareLinks(JSON.parse(savedLinks))
    if (savedActivity) setActivityLog(JSON.parse(savedActivity))
  }, [])

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem("web3-storage-files", JSON.stringify(files))
  }, [files])

  useEffect(() => {
    localStorage.setItem("web3-storage-links", JSON.stringify(shareLinks))
  }, [shareLinks])

  useEffect(() => {
    localStorage.setItem("web3-storage-activity", JSON.stringify(activityLog))
  }, [activityLog])

  const addFile = (file: StoredFile) => {
    setFiles((prev) => [file, ...prev])
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const addShareLink = (link: ShareLink) => {
    setShareLinks((prev) => [link, ...prev])
  }

  const removeShareLink = (id: string) => {
    setShareLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const addActivity = (activity: ActivityLog) => {
    setActivityLog((prev) => [activity, ...prev].slice(0, 100)) // Keep last 100 activities
  }

  const getFileById = (id: string) => {
    return files.find((f) => f.id === id)
  }

  return (
    <StorageContext.Provider
      value={{
        files,
        shareLinks,
        activityLog,
        addFile,
        removeFile,
        addShareLink,
        removeShareLink,
        addActivity,
        getFileById,
      }}
    >
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider")
  }
  return context
}
