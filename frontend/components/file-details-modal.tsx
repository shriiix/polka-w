"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Share2, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Lock, 
  Calendar,
  HardDrive,
  Users,
  Plus,
  X
} from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  file: {
    id: string
    name: string
    size: number
    type: string
    uploadedAt: Date
    cid: string
    encrypted: boolean
    sharedWith: string[]
    txHash?: string
  } | null
}

export function FileDetailsModal({ open, onOpenChange, file }: FileDetailsModalProps) {
  const [newWalletAddress, setNewWalletAddress] = useState("")
  const [accessList, setAccessList] = useState<string[]>(file?.sharedWith || [])

  if (!file) return null

  const handleAddAccess = () => {
    if (newWalletAddress && !accessList.includes(newWalletAddress)) {
      setAccessList([...accessList, newWalletAddress])
      setNewWalletAddress("")
    }
  }

  const handleRevokeAccess = (address: string) => {
    setAccessList(accessList.filter(a => a !== address))
  }

  const handleCopyCID = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(file.cid)
    }
  }

  const handleViewOnExplorer = () => {
    if (file.txHash && typeof window !== 'undefined') {
      window.open(`https://polkadot.js.org/apps/?rpc=wss://rpc.polkadot.io#/explorer/query/${file.txHash}`, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-950 border-gray-900 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">File Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">File Name</label>
              <p className="text-lg font-semibold text-white mt-1">{file.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Size
                </label>
                <p className="text-white mt-1">{formatBytes(file.size)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Uploaded
                </label>
                <p className="text-white mt-1">{formatDate(file.uploadedAt)}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400">IPFS CID</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 px-3 py-2 bg-gray-900 rounded text-sm font-mono text-gray-400 truncate">
                  {file.cid}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCID}
                  className="border-gray-800 hover:bg-gray-900"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {file.txHash && (
              <div>
                <label className="text-sm text-gray-400">Transaction Hash</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-3 py-2 bg-gray-900 rounded text-sm font-mono text-gray-400 truncate">
                    {file.txHash}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleViewOnExplorer}
                    className="border-gray-800 hover:bg-gray-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Badge className={`gap-1 border ${file.encrypted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                <Lock className="h-3 w-3" />
                {file.encrypted ? 'Encrypted' : 'Not Encrypted'}
              </Badge>
            </div>
          </div>

          {/* Access Control */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Access Control</h3>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter Polkadot wallet address"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
                className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
              />
              <Button
                onClick={handleAddAccess}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {accessList.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No shared access yet. Add wallet addresses above.
                </p>
              ) : (
                accessList.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                  >
                    <code className="text-sm font-mono text-gray-300">{address}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRevokeAccess(address)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <p className="text-xs text-gray-500">
              💡 Only the entered wallet addresses can decrypt and access this file.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-900">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" className="border-gray-800 hover:bg-gray-900 flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
