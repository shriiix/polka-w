"use client"

import { Download, Share2, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatBytes, formatDate } from "@/lib/utils"
import type { ReactNode } from "react"

interface FileCardProps {
  file: {
    id: string
    name: string
    size: number
    uploadedAt: Date
    encrypted: boolean
    sharedWith?: string[]
  }
  icon: ReactNode
  onShare: () => void
  onDelete: () => void
  onDownload?: () => void
}

export function FileCard({ file, icon, onShare, onDelete, onDownload }: FileCardProps) {
  return (
    <div className="p-6 hover:bg-gray-900/50 transition-colors flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 text-orange-500">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{file.name}</p>
          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span>{formatDate(file.uploadedAt)}</span>
            {file.encrypted && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20">
                  <Shield className="h-3 w-3" />
                  Encrypted
                </Badge>
              </>
            )}
            {file.sharedWith && file.sharedWith.length > 0 && (
              <>
                <span>•</span>
                <Badge variant="secondary" className="gap-1 bg-blue-500/10 text-blue-400 border-blue-500/20">
                  Shared with {file.sharedWith.length}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-10 w-10">
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
          {onDownload && (
            <DropdownMenuItem onClick={onDownload} className="gap-2 text-gray-300 hover:text-white cursor-pointer">
              <Download className="h-4 w-4" />
              Download
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={onShare} className="gap-2 text-gray-300 hover:text-white cursor-pointer">
            <Share2 className="h-4 w-4" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-400 hover:text-red-300 cursor-pointer">
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
