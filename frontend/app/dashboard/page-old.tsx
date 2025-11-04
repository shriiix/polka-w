"use client"

import { useState, useCallback, useRef } from "react"
import {
  Upload,
  Search,
  Share2,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  HardDrive,
  Folder,
  Filter,
  SortAsc,
  Grid3x3,
  List,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Cloud,
  Lock,
  CheckCircle2,
  MoreVertical,
  Star,
  Bookmark,
  Eye,
  ChevronDown,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadModal } from "@/components/upload-modal"
import { ShareModal } from "@/components/share-modal"
import { FileCard } from "@/components/file-card"
import { formatBytes } from "@/lib/utils"
import { useStorage } from "@/contexts/storage-context"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"

type ViewMode = 'list' | 'grid'
type SortBy = 'name' | 'date' | 'size' | 'type'
type FilterBy = 'all' | 'documents' | 'images' | 'videos' | 'audio'

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [filterBy, setFilterBy] = useState<FilterBy>('all')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { files, removeFile, addActivity } = useStorage()

  // Filter files based on search and filter
  const getFilteredFiles = () => {
    let filtered = files.filter((file) => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Apply category filter
    if (filterBy !== 'all') {
      filtered = filtered.filter((file) => {
        const type = file.type || ''
        switch (filterBy) {
          case 'documents':
            return type.includes('pdf') || type.includes('text') || type.includes('document')
          case 'images':
            return type.startsWith('image/')
          case 'videos':
            return type.startsWith('video/')
          case 'audio':
            return type.startsWith('audio/')
          default:
            return true
        }
      })
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'size':
          return b.size - a.size
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredFiles = getFilteredFiles()
  const totalStorage = files.reduce((acc, file) => acc + file.size, 0)
  const sharedCount = files.filter((f) => (f.sharedWith?.length || 0) > 0).length

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) {
      setUploadModalOpen(true)
    }
  }, [])

  // File selection handlers
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const selectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)))
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedFiles.size} selected file(s)?`)) {
      selectedFiles.forEach(fileId => {
        const file = files.find(f => f.id === fileId)
        if (file) {
          removeFile(fileId)
          addActivity({
            id: Date.now().toString(),
            action: 'delete',
            fileName: file.name,
            timestamp: new Date(),
          })
        }
      })
      setSelectedFiles(new Set())
    }
  }

  const handleDelete = (fileId: string, fileName: string) => {
    if (confirm(`Are you sure you want to delete ${fileName}?`)) {
      removeFile(fileId)
      addActivity({
        id: Date.now().toString(),
        action: 'delete',
        fileName: fileName,
        timestamp: new Date(),
      })
    }
  }

  const handleDownload = async (file: any) => {
    try {
      // For demo, we'll create a download link
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
    }
  }

  const handleShare = (fileId: string) => {
    setSelectedFileId(fileId)
    setShareModalOpen(true)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <FileImage className="h-5 w-5" />
    if (type.startsWith("video/")) return <FileVideo className="h-5 w-5" />
    if (type.startsWith("audio/")) return <FileAudio className="h-5 w-5" />
    if (type.includes("text") || type.includes("pdf")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  return (
    <div 
      className="min-h-screen bg-black"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="text-center">
              <div className="h-32 w-32 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-6 border-4 border-dashed border-orange-500">
                <Upload className="h-16 w-16 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Drop files here</h3>
              <p className="text-gray-400">Files will be encrypted and uploaded to IPFS</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="p-6 md:p-8">
        {/* Stats Cards with animations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gray-950 border-gray-900 p-6 hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">Total Files</p>
                  <p className="text-4xl font-bold text-white tracking-tight">{files.length}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">
                    {filteredFiles.length !== files.length && `${filteredFiles.length} filtered`}
                  </p>
                </div>
                <div className="h-14 w-14 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Folder className="h-7 w-7 text-orange-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gray-950 border-gray-900 p-6 hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">Storage Used</p>
                  <p className="text-4xl font-bold text-white tracking-tight">{formatBytes(totalStorage)}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Across all files</p>
                </div>
                <div className="h-14 w-14 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <HardDrive className="h-7 w-7 text-orange-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gray-950 border-gray-900 p-6 hover:border-orange-500/50 transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-2">Shared Files</p>
                  <p className="text-4xl font-bold text-white tracking-tight">{sharedCount}</p>
                  <p className="text-xs font-medium text-gray-500 mt-1">Active shares</p>
                </div>
                <div className="h-14 w-14 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                  <Share2 className="h-7 w-7 text-orange-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Toolbar - Search, Filters, and Actions */}
        <Card className="bg-gray-950 border-gray-900 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                placeholder="Search files by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black border-gray-800 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-black border-gray-800 hover:bg-gray-900 font-medium">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {filterBy === 'all' ? 'All Files' : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                    </span>
                    <span className="sm:hidden">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-950 border-gray-800">
                  <DropdownMenuLabel className="font-semibold text-gray-300">Filter by type</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    onClick={() => setFilterBy('all')} 
                    className={`cursor-pointer font-medium ${filterBy === 'all' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {filterBy === 'all' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <span className={filterBy === 'all' ? 'ml-0' : 'ml-6'}>All Files</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterBy('documents')} 
                    className={`cursor-pointer font-medium ${filterBy === 'documents' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {filterBy === 'documents' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <FileText className={`h-4 w-4 ${filterBy === 'documents' ? 'ml-0' : 'ml-6'} mr-2`} />
                    Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterBy('images')} 
                    className={`cursor-pointer font-medium ${filterBy === 'images' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {filterBy === 'images' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <FileImage className={`h-4 w-4 ${filterBy === 'images' ? 'ml-0' : 'ml-6'} mr-2`} />
                    Images
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterBy('videos')} 
                    className={`cursor-pointer font-medium ${filterBy === 'videos' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {filterBy === 'videos' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <FileVideo className={`h-4 w-4 ${filterBy === 'videos' ? 'ml-0' : 'ml-6'} mr-2`} />
                    Videos
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterBy('audio')} 
                    className={`cursor-pointer font-medium ${filterBy === 'audio' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {filterBy === 'audio' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <FileAudio className={`h-4 w-4 ${filterBy === 'audio' ? 'ml-0' : 'ml-6'} mr-2`} />
                    Audio
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-black border-gray-800 hover:bg-gray-900 font-medium">
                    <SortAsc className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {sortBy === 'date' ? 'Date' : sortBy === 'name' ? 'Name' : 'Size'}
                    </span>
                    <span className="sm:hidden">Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-950 border-gray-800">
                  <DropdownMenuLabel className="font-semibold text-gray-300">Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem 
                    onClick={() => setSortBy('date')} 
                    className={`cursor-pointer font-medium ${sortBy === 'date' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {sortBy === 'date' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <span className={sortBy === 'date' ? 'ml-0' : 'ml-6'}>Date Modified</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('name')} 
                    className={`cursor-pointer font-medium ${sortBy === 'name' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {sortBy === 'name' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <span className={sortBy === 'name' ? 'ml-0' : 'ml-6'}>Name</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortBy('size')} 
                    className={`cursor-pointer font-medium ${sortBy === 'size' ? 'bg-orange-500/10 text-orange-400' : 'text-white'}`}
                  >
                    {sortBy === 'size' && <CheckCircle2 className="h-4 w-4 mr-2 text-orange-500" />}
                    <span className={sortBy === 'size' ? 'ml-0' : 'ml-6'}>Size</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-800 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-gray-900'}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-gray-900'}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Upload Button */}
              <Button
                onClick={() => setUploadModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 gap-2"
              >
                <Upload className="h-5 w-5" />
                Upload
              </Button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedFiles.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-400">
                  {selectedFiles.size} selected
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFiles(new Set())}
                  className="text-gray-400 hover:text-white"
                >
                  Clear selection
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </motion.div>
          )}
        </Card>

        {/* Files Display */}
        {filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="bg-gray-950 border-gray-900 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-20 w-20 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Cloud className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  {searchQuery || filterBy !== 'all' ? 'No files found' : 'No files yet'}
                </h3>
                <p className="text-gray-400 mb-6 font-medium">
                  {searchQuery 
                    ? "Try adjusting your search or filters" 
                    : filterBy !== 'all'
                    ? "No files in this category"
                    : "Upload your first file to get started with ChainVault"}
                </p>
                {!searchQuery && filterBy === 'all' && (
                  <Button
                    onClick={() => setUploadModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Files
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ) : viewMode === 'list' ? (
          /* List View */
          <Card className="bg-gray-950 border-gray-900 overflow-hidden">
            {/* Select All Header */}
            <div className="p-4 border-b border-gray-900 flex items-center gap-3 bg-gray-900/50">
              <button
                onClick={selectAll}
                className="text-gray-400 hover:text-white transition"
              >
                {selectedFiles.size === filteredFiles.length ? (
                  <CheckSquare className="h-5 w-5 text-orange-500" />
                ) : (
                  <Square className="h-5 w-5" />
                )}
              </button>
              <span className="text-sm font-medium text-gray-400">
                {selectedFiles.size > 0 
                  ? `${selectedFiles.size} of ${filteredFiles.length} selected`
                  : `${filteredFiles.length} files`}
              </span>
            </div>

            <div className="divide-y divide-gray-900">
              <AnimatePresence mode="popLayout">
                {filteredFiles.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <button
                        onClick={() => toggleFileSelection(file.id)}
                        className="text-gray-400 hover:text-white transition"
                      >
                        {selectedFiles.has(file.id) ? (
                          <CheckSquare className="h-5 w-5 text-orange-500" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div className="pl-12">
                      <FileCard
                        file={file}
                        icon={getFileIcon(file.type || '')}
                        onShare={() => handleShare(file.id)}
                        onDelete={() => handleDelete(file.id, file.name)}
                        onDownload={() => handleDownload(file)}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-950 border-gray-900 p-6 hover:border-orange-500/50 transition-all group relative">
                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleFileSelection(file.id)}
                      className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white transition"
                    >
                      {selectedFiles.has(file.id) ? (
                        <CheckSquare className="h-5 w-5 text-orange-500" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>

                    {/* File icon */}
                    <div className="h-20 w-20 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors text-orange-500">
                      {getFileIcon(file.type || '')}
                    </div>

                    {/* File info */}
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-white truncate mb-1">{file.name}</h3>
                      <p className="text-sm font-medium text-gray-400">{formatBytes(file.size)}</p>
                      {file.encrypted && (
                        <Badge className="mt-2 gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20 font-medium">
                          <Lock className="h-3 w-3" />
                          Encrypted
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file)}
                        className="flex-1 gap-2 border-gray-800 hover:bg-gray-900"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-800 hover:bg-gray-900"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-950 border-gray-900">
                          <DropdownMenuItem 
                            onClick={() => handleShare(file.id)} 
                            className="gap-2 text-gray-300 hover:text-white cursor-pointer"
                          >
                            <Share2 className="h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(file.id, file.name)} 
                            className="gap-2 text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Hidden file input for drag and drop */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            setUploadModalOpen(true)
          }
        }}
      />

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
      <ShareModal open={shareModalOpen} onOpenChange={setShareModalOpen} fileId={selectedFileId} />
    </div>
  )
}
