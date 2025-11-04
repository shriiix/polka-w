"use client"

import { useState } from "react"
import { Trash2, Download, AlertTriangle, Moon, Sun, Shield, Key, Wallet as WalletIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatBytes } from "@/lib/utils"

// Mock data
const mockStats = {
  totalFiles: 3,
  totalStorage: 16600000,
  sharedFiles: 2,
  walletAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  network: "Polkadot",
}

export default function SettingsPage() {
  const [autoEncrypt, setAutoEncrypt] = useState(true)
  const [autoConfirm, setAutoConfirm] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [encryptionMode, setEncryptionMode] = useState("aes")

  const handleExportKey = () => {
    if (typeof window !== 'undefined' && confirm("Are you sure you want to export your encryption key? Keep it safe!")) {
      // Export key logic
      alert("Key export feature - save this securely!")
    }
  }

  const handleExportData = () => {
    if (typeof window !== 'undefined') {
      const data = {
        exportedAt: new Date().toISOString(),
        stats: mockStats,
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `web3-backup-export-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleClearData = () => {
    if (typeof window !== 'undefined' && confirm("Are you sure you want to clear all local data? This action cannot be undone.")) {
      localStorage.clear()
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and application preferences</p>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Wallet Connection Section */}
          <Card className="bg-gray-950 border-gray-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <WalletIcon className="h-5 w-5 text-orange-500" />
              Wallet Connection
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-900">
                <div>
                  <p className="font-medium text-white">Wallet Address</p>
                  <p className="text-sm text-gray-400 font-mono break-all">{mockStats.walletAddress}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-900">
                <div>
                  <p className="font-medium text-white">Network</p>
                  <p className="text-sm text-gray-400">{mockStats.network}</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-900">
                <div>
                  <p className="font-medium text-white">Total Files</p>
                  <p className="text-sm text-gray-400">{mockStats.totalFiles} files</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-white">Storage Used</p>
                  <p className="text-sm text-gray-400">{formatBytes(mockStats.totalStorage)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Encryption Settings */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-500" />
              Encryption Settings
            </h2>
            <div className="space-y-6">
              <div>
                <Label className="dark:text-white text-gray-900 mb-2 block font-semibold">Encryption Mode</Label>
                <Select value={encryptionMode} onValueChange={setEncryptionMode}>
                  <SelectTrigger className="dark:bg-gray-900 bg-gray-100 dark:border-gray-800 border-gray-300 dark:text-white text-gray-900 font-medium">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200">
                    <SelectItem value="aes" className="dark:text-white text-gray-900 font-medium">AES-256 (Recommended)</SelectItem>
                    <SelectItem value="rsa" className="dark:text-white text-gray-900 font-medium">RSA-2048</SelectItem>
                    <SelectItem value="hybrid" className="dark:text-white text-gray-900 font-medium">Hybrid (AES + RSA)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs dark:text-gray-400 text-gray-600 mt-1 font-medium">Choose encryption algorithm for your files</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t dark:border-gray-900 border-gray-200">
                <div>
                  <p className="font-medium dark:text-white text-gray-900">Backup Encryption Key</p>
                  <p className="text-sm dark:text-gray-400 text-gray-600">Export your key for recovery</p>
                </div>
                <Button
                  onClick={handleExportKey}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  <Key className="h-4 w-4" />
                  Export Key
                </Button>
              </div>
            </div>
          </Card>

          {/* Preferences Section */}
          <Card className="bg-gray-950 border-gray-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Auto-encrypt uploads</Label>
                  <p className="text-sm text-gray-400">Automatically encrypt all uploaded files</p>
                </div>
                <Switch checked={autoEncrypt} onCheckedChange={setAutoEncrypt} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Auto-upload confirmation</Label>
                  <p className="text-sm text-gray-400">Skip confirmation dialog when uploading</p>
                </div>
                <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white">Notifications</Label>
                  <p className="text-sm text-gray-400">Receive notifications for file operations</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white flex items-center gap-2">
                    {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    Theme
                  </Label>
                  <p className="text-sm text-gray-400">Toggle between light and dark mode</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </div>
          </Card>

          {/* Data Management Section */}
          <Card className="bg-gray-950 border-gray-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-900">
                <div>
                  <p className="font-medium text-white">Export Data</p>
                  <p className="text-sm text-gray-400">Download all your data as JSON</p>
                </div>
                <Button
                  onClick={handleExportData}
                  className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-white">Clear Local Data</p>
                  <p className="text-sm text-gray-400">Remove all data from this device</p>
                </div>
                <Button
                  onClick={handleClearData}
                  className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="bg-gray-950 border-gray-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About</h2>
            <div className="space-y-3 text-sm text-gray-400">
              <p>
                <strong className="text-white">Web3 Cloud Backup</strong> is a decentralized storage solution powered by
                IPFS and Polkadot.
              </p>
              <p>Your files are encrypted and stored securely on the distributed IPFS network.</p>
              <p className="flex items-center gap-2 text-xs text-orange-400">
                <AlertTriangle className="h-4 w-4" />
                Remember to backup your encryption passwords - they cannot be recovered.
              </p>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gray-950 border-red-500/20 p-6">
            <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Disconnect Wallet</p>
                  <p className="text-sm text-gray-400">Sign out and disconnect your wallet</p>
                </div>
                <Button className="gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20">
                  Disconnect
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
