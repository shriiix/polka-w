"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Folder,
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  Music,
  Star,
  Trash2,
  Bookmark,
  Eye,
  Download,
  Share2,
  ChevronDown,
  Cloud,
  HardDrive,
  Settings,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadModal } from "@/components/upload-modal"
import { ShareModal } from "@/components/share-modal"
import { TokenBalanceWidget } from "@/components/token-balance-widget"
import { useStorage } from "@/contexts/storage-context"
import { formatBytes } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [sortBy, setSortBy] = useState<'type' | 'name' | 'date' | 'size'>('type')
  
  const { files, removeFile, addActivity } = useStorage()

  const totalStorage = files.reduce((acc, file) => acc + file.size, 0)
  const storageLimit = 160 * 1024 * 1024 * 1024 // 160 GB
  const storagePercentage = (totalStorage / storageLimit) * 100

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort files based on sortBy state
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      case 'size':
        return b.size - a.size
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  // Group files by type/folder
  const folders = [
    { name: "UI / UX design", count: 5, size: 21.5 * 1024 * 1024, icon: Folder, color: "text-purple-500" },
    { name: "My video", count: 152, size: 2.4 * 1024 * 1024 * 1024, icon: FileVideo, color: "text-red-500" },
    { name: "My music", count: 24, size: 434 * 1024 * 1024, icon: Music, color: "text-purple-500" },
  ]

  const recentFiles = sortedFiles.slice(0, 6)

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-12 w-12" />
    if (type.startsWith("video/")) return <FileVideo className="h-12 w-12" />
    if (type.includes("pdf") || type.includes("text")) return <FileText className="h-12 w-12" />
    if (type.startsWith("audio/")) return <Music className="h-12 w-12" />
    return <FileText className="h-12 w-12" />
  }

  const handleFileClick = (file: any) => {
    setSelectedFile(file)
  }

  const handleView = (file: any) => {
    // Open file in new tab if it's viewable (images, PDFs, videos)
    if (file.cid) {
      const url = `https://w3s.link/ipfs/${file.cid}`
      window.open(url, '_blank')
    } else {
      // Fallback to sidebar
      setSelectedFile(file)
    }
  }

  const handleDownload = async (file: any) => {
    try {
      const url = `https://w3s.link/ipfs/${file.cid}`
      const link = document.createElement('a')
      link.href = url
      link.download = file.name
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      addActivity({
        id: Date.now().toString(),
        action: 'download',
        fileName: file.name,
        timestamp: new Date(),
      })
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  const handleDelete = (file: any) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      removeFile(file.id)
      addActivity({
        id: Date.now().toString(),
        action: 'delete',
        fileName: file.name,
        timestamp: new Date(),
      })
      if (selectedFile?.id === file.id) {
        setSelectedFile(null)
      }
    }
  }

  const handleShare = (file: any) => {
    setSelectedFileId(file.id)
    setShareModalOpen(true)
  }

  const handleSortChange = (newSort: 'type' | 'name' | 'date' | 'size') => {
    setSortBy(newSort)
  }

  return (
    <div className="flex h-screen dark:bg-black bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="dark:bg-gray-950 bg-white dark:border-b dark:border-gray-900 border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Add File
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 dark:text-gray-400 text-gray-600">
                <Cloud className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {formatBytes(totalStorage)} / {formatBytes(storageLimit)} Gb
                </span>
                <span className="text-sm">Storage Usage</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => router.push('/dashboard/settings')}
                title="Settings"
              >
                <Settings className="h-5 w-5 dark:text-gray-400 text-gray-600" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                title="User Profile"
              >
                <User className="h-5 w-5 dark:text-gray-400 text-gray-600" />
              </Button>
              <Avatar className="h-8 w-8 cursor-pointer" title="Profile">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Token Balance Widget */}
            <div className="mb-6">
              <TokenBalanceWidget />
            </div>

            {/* Header with Sort */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold dark:text-white text-gray-900">My Cloud</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm dark:text-gray-400 text-gray-600">Sort by</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 dark:text-white text-gray-900 capitalize">
                        {sortBy}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleSortChange('name')}>Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange('date')}>Date</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange('size')}>Size</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSortChange('type')}>Type</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Grid3x3 className="h-5 w-5" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <List className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              {folders.map((folder, index) => (
                <motion.div
                  key={folder.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6 hover:dark:border-purple-500/50 hover:border-purple-500/50 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl dark:bg-gray-900 bg-gray-100 ${folder.color}`}>
                        <folder.icon className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold dark:text-white text-gray-900 mb-1">{folder.name}</h3>
                    <p className="text-sm dark:text-gray-400 text-gray-600 mb-3">{folder.count} files</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-white text-gray-900">
                        {formatBytes(folder.size)}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 dark:border-gray-950 border-white -ml-2 first:ml-0">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} />
                            <AvatarFallback>U{i}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Recent Files Grid */}
            <div className="grid grid-cols-3 gap-6">
              {recentFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 3) * 0.1 }}
                  onClick={() => handleFileClick(file)}
                >
                  <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6 hover:dark:border-purple-500/50 hover:border-purple-500/50 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl dark:bg-gray-900 bg-gray-100 text-purple-500">
                        {getFileIcon(file.type)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleView(file)
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View File
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleFileClick(file)
                          }}>
                            <FolderOpen className="h-4 w-4 mr-2" />
                            Show Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleShare(file)
                          }}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleDownload(file)
                          }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(file)
                          }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <h3 className="font-semibold dark:text-white text-gray-900 mb-1 truncate">{file.name}</h3>
                    <p className="text-xs dark:text-gray-400 text-gray-600 mb-3">
                      {new Date(file.uploadedAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}, {new Date(file.uploadedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium dark:text-white text-gray-900">
                        {formatBytes(file.size)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-6 w-6 border-2 dark:border-gray-950 border-white">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${file.id}`} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - File Details */}
      <AnimatePresence>
        {selectedFile && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="w-96 dark:bg-gray-950 bg-white dark:border-l dark:border-gray-900 border-l border-gray-200 p-6 overflow-auto relative"
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6">
            {/* Preview Image */}
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 aspect-video flex items-center justify-center relative">
              {selectedFile.type.startsWith('image/') && selectedFile.file ? (
                <img src={URL.createObjectURL(selectedFile.file)} alt={selectedFile.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6">
                  <div className="text-purple-500 flex justify-center mb-3">
                    {getFileIcon(selectedFile.type)}
                  </div>
                  <p className="text-sm dark:text-gray-400 text-gray-600">No preview available</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                onClick={() => handleView(selectedFile)}
                title="View File"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                onClick={() => handleDownload(selectedFile)}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                title="Favorite"
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                onClick={() => handleDelete(selectedFile)}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                title="Bookmark"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="dark:bg-gray-900 bg-gray-100"
                title="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>

            {/* File Name */}
            <div>
              <h2 className="text-xl font-bold dark:text-white text-gray-900 mb-2">{selectedFile.name}</h2>
              <p className="text-sm dark:text-gray-400 text-gray-600">PNG Image</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="dark:bg-gray-900 bg-gray-100">3d concept</Badge>
              <Badge variant="secondary" className="dark:bg-gray-900 bg-gray-100">futuristic</Badge>
              <Badge variant="secondary" className="dark:bg-gray-900 bg-gray-100">purple</Badge>
              <Badge variant="secondary" className="dark:bg-gray-900 bg-gray-100">minimalistic</Badge>
              <Badge variant="secondary" className="dark:bg-gray-900 bg-gray-100">highly detailed</Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold dark:text-white text-gray-900 mb-2">Description</h3>
              <p className="text-sm dark:text-gray-400 text-gray-600 leading-relaxed">
                Encrypted file stored on IPFS with blockchain verification. Protected by {selectedFile.encryption || 'AES-256'} encryption.
              </p>
            </div>

            {/* Info */}
            <div>
              <h3 className="font-semibold dark:text-white text-gray-900 mb-3">Info</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-400 text-gray-600">Size</span>
                  <span className="dark:text-white text-gray-900 font-medium">{formatBytes(selectedFile.size)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="dark:text-gray-400 text-gray-600">Date</span>
                  <span className="dark:text-white text-gray-900 font-medium">
                    {new Date(selectedFile.uploadedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Share with */}
            <div>
              <h3 className="font-semibold dark:text-white text-gray-900 mb-3">Share with</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <Avatar key={i} className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Share${i}`} />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                ))}
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-10 w-10 rounded-full"
                  onClick={() => handleShare(selectedFile)}
                  title="Share file"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        fileId={selectedFileId}
      />
    </div>
  )
}
