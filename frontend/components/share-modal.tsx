"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Copy, Check, Calendar, Lock } from "lucide-react"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileId: string | null
}

export function ShareModal({ open, onOpenChange, fileId }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [expiresIn, setExpiresIn] = useState("7")
  const [maxAccess, setMaxAccess] = useState("")
  const [requirePassword, setRequirePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [shareLink, setShareLink] = useState<string | null>(null)

  const generateShareLink = () => {
    const linkId = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/share/${linkId}`
    setShareLink(link)
  }

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClose = () => {
    setShareLink(null)
    setExpiresIn("7")
    setMaxAccess("")
    setRequirePassword(false)
    setPassword("")
    setCopied(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-950 border-gray-900">
        <DialogHeader>
          <DialogTitle className="text-white">Share File</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!shareLink ? (
            <>
              {/* Expiration */}
              <div className="space-y-2">
                <Label className="text-gray-300">Link Expiration</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <Input
                    type="number"
                    placeholder="Days until expiration"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    min="1"
                    className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                  />
                  <span className="text-sm text-gray-400 whitespace-nowrap">days</span>
                </div>
                <p className="text-xs text-gray-500">Leave empty for no expiration</p>
              </div>

              {/* Max Access */}
              <div className="space-y-2">
                <Label className="text-gray-300">Maximum Access Count</Label>
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={maxAccess}
                  onChange={(e) => setMaxAccess(e.target.value)}
                  min="1"
                  className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                />
                <p className="text-xs text-gray-500">Limit how many times the link can be accessed</p>
              </div>

              {/* Password Protection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-gray-300">Password Protection</Label>
                    <p className="text-sm text-gray-500">Require a password to access</p>
                  </div>
                  <Switch checked={requirePassword} onCheckedChange={setRequirePassword} />
                </div>

                {requirePassword && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Access Password</Label>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-orange-500" />
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-900 border-gray-800 text-white placeholder:text-gray-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={generateShareLink}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                Generate Share Link
              </Button>
            </>
          ) : (
            <>
              {/* Share Link Display */}
              <div className="space-y-2">
                <Label className="text-gray-300">Share Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="font-mono text-sm bg-gray-900 border-gray-800 text-gray-300"
                  />
                  <Button
                    onClick={copyToClipboard}
                    size="icon"
                    className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Link Details */}
              <div className="space-y-2 p-4 bg-gray-900/50 border border-gray-900 rounded-lg">
                <p className="text-sm font-medium text-gray-300">Link Details</p>
                <div className="space-y-1 text-sm text-gray-500">
                  {expiresIn && <p>Expires in {expiresIn} days</p>}
                  {maxAccess && <p>Maximum {maxAccess} access(es)</p>}
                  {requirePassword && <p>Password protected</p>}
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                Done
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
