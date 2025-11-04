"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, FileIcon, X, Lock, Cloud, CheckCircle2, AlertCircle, Eye, EyeOff, ShieldCheck, ShieldAlert } from "lucide-react"
import { useStorage } from "@/contexts/storage-context"
import type { StoredFile } from "@/lib/types"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type UploadStatus = 'idle' | 'encrypting' | 'uploading' | 'onchain' | 'complete' | 'error'

type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong'

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [encrypt, setEncrypt] = useState(true)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [cid, setCid] = useState("")
  const [error, setError] = useState("")
  
  const { addFile, addActivity } = useStorage()

  // Calculate password strength
  const passwordStrength = useMemo((): { strength: PasswordStrength; score: number } => {
    if (!password) return { strength: 'weak', score: 0 }
    
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 25
    if (password.length >= 12) score += 15
    if (password.length >= 16) score += 10
    
    // Complexity checks
    if (/[a-z]/.test(password)) score += 10 // lowercase
    if (/[A-Z]/.test(password)) score += 15 // uppercase
    if (/[0-9]/.test(password)) score += 15 // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 20 // special chars
    
    // Determine strength
    let strength: PasswordStrength = 'weak'
    if (score >= 80) strength = 'very-strong'
    else if (score >= 60) strength = 'strong'
    else if (score >= 40) strength = 'medium'
    
    return { strength, score }
  }, [password])

  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'strong': return 'bg-blue-500'
      case 'very-strong': return 'bg-green-500'
    }
  }

  const getStrengthText = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return 'Weak'
      case 'medium': return 'Medium'
      case 'strong': return 'Strong'
      case 'very-strong': return 'Very Strong'
    }
  }

  const getStrengthIcon = (strength: PasswordStrength) => {
    if (strength === 'weak' || strength === 'medium') {
      return <ShieldAlert className="h-4 w-4" />
    }
    return <ShieldCheck className="h-4 w-4" />
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedFiles([])
        setPassword("")
        setStatus('idle')
        setProgress(0)
        setCid("")
        setError("")
      }, 300)
    }
  }, [open])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
      setError("")
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    if (encrypt && !password) {
      setError("Please enter an encryption password")
      return
    }

    setUploading(true)
    setProgress(0)
    setError("")

    try {
      // Step 1: Encrypting
      setStatus('encrypting')
      setProgress(25)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 2: Uploading to IPFS
      setStatus('uploading')
      setProgress(50)
      await new Promise(resolve => setTimeout(resolve, 1500))
      const mockCid = 'Qm' + Math.random().toString(36).substring(2, 15)
      setCid(mockCid)

      // Step 3: On-chain confirmation
      setStatus('onchain')
      setProgress(75)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Step 4: Complete - Save to storage
      setStatus('complete')
      setProgress(100)
      
      // Add files to storage
      selectedFiles.forEach(file => {
        const storedFile: StoredFile = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          cid: mockCid,
          uploadedAt: new Date(),
          encrypted: encrypt,
          sharedWith: [],
          tags: [],
        }
        
        addFile(storedFile)
        
        // Add activity log
        addActivity({
          id: Date.now().toString(),
          action: 'upload',
          fileName: file.name,
          timestamp: new Date(),
        })
      })

      await new Promise(resolve => setTimeout(resolve, 800))

      // Close modal
      onOpenChange(false)
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'encrypting':
        return (
          <Badge className="gap-1 bg-orange-500/10 text-orange-400 border-orange-500/20">
            <Lock className="h-3 w-3" />
            Encrypting locally...
          </Badge>
        )
      case 'uploading':
        return (
          <Badge className="gap-1 bg-blue-500/10 text-blue-400 border-blue-500/20">
            <Cloud className="h-3 w-3" />
            Uploading to IPFS...
          </Badge>
        )
      case 'onchain':
        return (
          <Badge className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20">
            ⛓️ On-chain confirmation...
          </Badge>
        )
      case 'complete':
        return (
          <Badge className="gap-1 bg-green-500/10 text-green-400 border-green-500/20">
            <CheckCircle2 className="h-3 w-3" />
            Upload complete!
          </Badge>
        )
      case 'error':
        return (
          <Badge className="gap-1 bg-red-500/10 text-red-400 border-red-500/20">
            <AlertCircle className="h-3 w-3" />
            Upload failed
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-950 bg-white dark:border-gray-800 border-gray-200 dark:text-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-gray-900 font-bold">Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label className="dark:text-white text-gray-900 font-medium">Select Files</Label>
            <div className="border-2 border-dashed dark:border-gray-700 border-gray-300 rounded-lg p-8 text-center dark:hover:border-orange-500/50 hover:border-orange-500/70 transition-colors dark:bg-gray-900/30 bg-gray-50/50">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p className="text-sm dark:text-gray-300 text-gray-700 font-medium">Click to select files or drag and drop</p>
              </label>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="dark:text-white text-gray-900 font-medium">Selected Files ({selectedFiles.length})</Label>
              <div className="border dark:border-gray-800 border-gray-200 rounded-lg divide-y dark:divide-gray-800 divide-gray-200 max-h-[200px] overflow-y-auto dark:bg-gray-900/30 bg-gray-50/50">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 transition-colors">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileIcon className="h-4 w-4 flex-shrink-0 text-orange-500" />
                      <span className="text-sm truncate dark:text-white text-gray-900 font-medium">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                      className="flex-shrink-0 dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-800 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encryption Options */}
          <div className="space-y-4 p-4 rounded-lg dark:bg-gray-900/50 bg-gray-50/50 border dark:border-gray-800 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="dark:text-white text-gray-900 font-semibold">Enable Encryption</Label>
                <p className="text-sm dark:text-gray-400 text-gray-600 font-medium">Encrypt files before uploading</p>
              </div>
              <Switch checked={encrypt} onCheckedChange={setEncrypt} disabled={uploading} />
            </div>

            {encrypt && (
              <div className="space-y-3">
                <Label htmlFor="password" className="dark:text-white text-gray-900 font-semibold">
                  Encryption Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={uploading}
                    className="pr-10 dark:bg-gray-900 bg-gray-100 dark:border-gray-700 border-gray-300 dark:text-white text-gray-900 dark:placeholder:text-gray-500 placeholder:text-gray-500 dark:focus:border-orange-500 focus:border-orange-500 dark:focus:ring-orange-500/20 focus:ring-orange-500/20 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition"
                    disabled={uploading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2 p-3 rounded-lg dark:bg-gray-900/50 bg-gray-50/50 border dark:border-gray-800 border-gray-200">
                    <div className="flex items-center justify-between text-xs">
                      <span className="dark:text-gray-400 text-gray-600 font-medium">Password Strength:</span>
                      <Badge 
                        variant="secondary" 
                        className={`gap-1 font-semibold ${
                          passwordStrength.strength === 'weak' 
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : passwordStrength.strength === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            : passwordStrength.strength === 'strong'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}
                      >
                        {getStrengthIcon(passwordStrength.strength)}
                        {getStrengthText(passwordStrength.strength)}
                      </Badge>
                    </div>
                    <div className="h-2 dark:bg-gray-800 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full transition-all duration-300 shadow-sm ${getStrengthColor(passwordStrength.strength)}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                    {passwordStrength.strength === 'weak' && (
                      <p className="text-xs text-red-400 flex items-start gap-1.5 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Use at least 8 characters with uppercase, lowercase, numbers, and symbols</span>
                      </p>
                    )}
                    {passwordStrength.strength === 'medium' && (
                      <p className="text-xs text-yellow-400 flex items-start gap-1.5 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Good! Add more special characters or length for better security</span>
                      </p>
                    )}
                    {(passwordStrength.strength === 'strong' || passwordStrength.strength === 'very-strong') && (
                      <p className="text-xs text-green-400 flex items-start gap-1.5 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>Excellent! Your password is secure</span>
                      </p>
                    )}
                  </div>
                )}

                <p className="text-xs dark:text-gray-400 text-gray-600 font-medium">Remember this password - you'll need it to decrypt your files</p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3 p-3 rounded-lg dark:bg-gray-900/50 bg-gray-50/50 border dark:border-gray-800 border-gray-200">
              <div className="flex items-center justify-between">
                {getStatusBadge()}
                <span className="text-sm dark:text-white text-gray-900 font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="dark:bg-gray-800 bg-gray-200" />
              {cid && (
                <div className="text-xs dark:text-gray-400 text-gray-600 font-medium">
                  <span className="dark:text-white text-gray-900 font-semibold">CID:</span> {cid}
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2 font-medium">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
            className="bg-transparent dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-gray-900 dark:hover:bg-gray-800 hover:bg-gray-100 font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold dark:disabled:bg-gray-800 disabled:bg-gray-300 dark:disabled:text-gray-500 disabled:text-gray-500"
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
