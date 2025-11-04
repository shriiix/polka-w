"use client"

import { useState } from "react"
import { Share2, Copy, Trash2, ExternalLink, Calendar, Eye, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDate } from "@/lib/utils"

// Mock shared links data
const mockShareLinks = [
  {
    id: "share1",
    fileName: "Project Proposal.pdf",
    createdAt: new Date(Date.now() - 86400000),
    accessCount: 5,
    expiresAt: new Date(Date.now() + 604800000),
    maxAccess: 10,
    password: true,
  },
  {
    id: "share2",
    fileName: "Design System.figma",
    createdAt: new Date(Date.now() - 172800000),
    accessCount: 12,
    expiresAt: null,
    maxAccess: null,
    password: false,
  },
]

export default function SharedPage() {
  const [shareLinks] = useState(mockShareLinks)

  const handleCopyLink = (linkId: string) => {
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/share/${linkId}`
      navigator.clipboard.writeText(link)
    }
  }

  const handleDeleteLink = (linkId: string) => {
    if (typeof window !== 'undefined' && confirm("Are you sure you want to delete this share link?")) {
      // Delete logic
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Shared Links</h1>
          <p className="text-gray-400">Manage your file share links and access permissions</p>
        </div>

        {shareLinks.length === 0 ? (
          <Card className="bg-gray-950 border-gray-900 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No shared links</h3>
              <p className="text-gray-400">Share files from your dashboard to create links</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {shareLinks.map((link) => (
              <Card key={link.id} className="bg-gray-950 border-gray-900 p-6 hover:bg-gray-900/50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg text-white">{link.fileName}</h3>
                      <p className="text-sm text-gray-400">Created {formatDate(link.createdAt)}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20">
                        <Eye className="h-3 w-3" />
                        {link.accessCount} {link.accessCount === 1 ? "view" : "views"}
                      </Badge>

                      {link.expiresAt && (
                        <Badge className="gap-1 bg-blue-500/10 text-blue-400 border-blue-500/20">
                          <Calendar className="h-3 w-3" />
                          Expires {formatDate(link.expiresAt)}
                        </Badge>
                      )}

                      {link.maxAccess && (
                        <Badge className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
                          Max {link.maxAccess} access{link.maxAccess > 1 ? "es" : ""}
                        </Badge>
                      )}

                      {link.password && (
                        <Badge className="gap-1 bg-green-500/10 text-green-400 border-green-500/20">
                          <Lock className="h-3 w-3" />
                          Protected
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-gray-900 rounded text-sm font-mono truncate text-gray-400">
                        {typeof window !== 'undefined' ? `${window.location.origin}/share/${link.id}` : `/share/${link.id}`}
                      </code>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-950 border-gray-900">
                      <DropdownMenuItem
                        onClick={() => handleCopyLink(link.id)}
                        className="gap-2 text-gray-300 hover:text-white cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => window.open(`/share/${link.id}`, "_blank")}
                        className="gap-2 text-gray-300 hover:text-white cursor-pointer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteLink(link.id)}
                        className="gap-2 text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
