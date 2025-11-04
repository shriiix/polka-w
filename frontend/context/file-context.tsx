"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { uploadToIPFS } from "@/lib/ipfs"
import { encryptFile, generateEncryptionKey } from "@/lib/encryption"
import { signTransaction } from "@/lib/polkadot"
import { useToast } from "@/hooks/use-toast"

export interface FileMetadata {
  id: string
  name: string
  size: number
  cid: string
  uploadDate: Date
  txHash: string
  isEncrypted: boolean
  isShared: boolean
  owner: string
  sharedWith?: string[]
}

interface FileContextType {
  files: FileMetadata[]
  isUploading: boolean
  uploadFile: (file: File, walletAddress: string) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  shareFile: (fileId: string, recipientAddress: string) => Promise<void>
}

const FileContext = createContext<FileContextType | undefined>(undefined)

export function FileProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileMetadata[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const uploadFile = async (file: File, walletAddress: string) => {
    setIsUploading(true)
    try {
      // Generate encryption key
      const key = await generateEncryptionKey()

      // Encrypt file
      const { encrypted } = await encryptFile(file, key)
      const encryptedFile = new File([encrypted], file.name, { type: file.type })

      // Upload to IPFS
      const ipfsResult = await uploadToIPFS(encryptedFile)

      // Sign transaction
      const txHash = await signTransaction(ipfsResult.cid, walletAddress)

      // Add to files list
      const newFile: FileMetadata = {
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        cid: ipfsResult.cid,
        uploadDate: new Date(),
        txHash,
        isEncrypted: true,
        isShared: false,
        owner: walletAddress,
      }

      setFiles((prev) => [newFile, ...prev])

      toast({
        title: "File Uploaded",
        description: `${file.name} has been encrypted and uploaded to IPFS.`,
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const deleteFile = async (fileId: string) => {
    try {
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
      toast({
        title: "File Deleted",
        description: "File has been removed from your storage.",
      })
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete file.",
        variant: "destructive",
      })
    }
  }

  const shareFile = async (fileId: string, recipientAddress: string) => {
    try {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, isShared: true, sharedWith: [...(f.sharedWith || []), recipientAddress] } : f,
        ),
      )
      toast({
        title: "File Shared",
        description: `File shared with ${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-6)}`,
      })
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share file.",
        variant: "destructive",
      })
    }
  }

  return (
    <FileContext.Provider value={{ files, isUploading, uploadFile, deleteFile, shareFile }}>
      {children}
    </FileContext.Provider>
  )
}

export function useFiles() {
  const context = useContext(FileContext)
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider")
  }
  return context
}
