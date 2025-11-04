"use client"

import { useState } from "react"
import { Download, Lock, Unlock, User, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatBytes, formatDate } from "@/lib/utils"

// Mock data for files shared with current user
const mockSharedFiles = [
  {
    id: "s1",
    name: "Q4 Report.pdf",
    size: 3500000,
    type: "application/pdf",
    sharedBy: "5E3C...9F8",
    sharedAt: new Date(Date.now() - 86400000),
    cid: "QmShared1",
    encrypted: true,
    decrypted: false,
  },
  {
    id: "s2",
    name: "Marketing Assets.zip",
    size: 12500000,
    type: "application/zip",
    sharedBy: "1A2B...3C4",
    sharedAt: new Date(Date.now() - 172800000),
    cid: "QmShared2",
    encrypted: true,
    decrypted: true,
  },
  {
    id: "s3",
    name: "Team Photo.jpg",
    size: 4800000,
    type: "image/jpeg",
    sharedBy: "7D8E...5F6",
    sharedAt: new Date(Date.now() - 259200000),
    cid: "QmShared3",
    encrypted: true,
    decrypted: true,
  },
]

export default function SharedWithMePage() {
  const [files, setFiles] = useState(mockSharedFiles)

  const handleDecrypt = (fileId: string) => {
    setFiles(
      files.map((f) =>
        f.id === fileId ? { ...f, decrypted: true } : f
      )
    )
  }

  const handleDownload = (file: any) => {
    if (!file.decrypted) {
      alert("Please decrypt the file first")
      return
    }
    // Download logic here
    console.log("Downloading", file.name)
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shared With Me</h1>
          <p className="text-gray-400">Files that other users have shared with your wallet</p>
        </div>

        {files.length === 0 ? (
          <Card className="bg-gray-950 border-gray-900 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No shared files</h3>
              <p className="text-gray-400">Files shared with you will appear here</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {files.map((file) => (
              <Card key={file.id} className="bg-gray-950 border-gray-900 p-6 hover:bg-gray-900/50 transition">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* File Icon */}
                  <div className="h-14 w-14 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-7 w-7 text-orange-500" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-white truncate">{file.name}</h3>
                        <p className="text-sm text-gray-400">{formatBytes(file.size)}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        <User className="h-3 w-3" />
                        From {file.sharedBy}
                      </Badge>
                      <Badge className="gap-1 bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <Calendar className="h-3 w-3" />
                        {formatDate(file.sharedAt)}
                      </Badge>
                      {file.encrypted && (
                        <Badge className={`gap-1 border ${file.decrypted ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                          {file.decrypted ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                          {file.decrypted ? 'Decrypted' : 'Encrypted'}
                        </Badge>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 font-mono truncate">
                      CID: {file.cid}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!file.decrypted && (
                      <Button
                        onClick={() => handleDecrypt(file.id)}
                        variant="outline"
                        className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Decrypt
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDownload(file)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!file.decrypted}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
