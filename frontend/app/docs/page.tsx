"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Book, 
  Search, 
  ChevronRight, 
  FileText, 
  Code, 
  Terminal, 
  Shield, 
  Zap, 
  Database,
  Lock,
  Upload,
  Download,
  Key,
  Wallet,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const sections = [
    {
      title: "Getting Started",
      icon: Zap,
      items: [
        { title: "Quick Start Guide", href: "#quick-start" },
        { title: "Connect Your Wallet", href: "#connect-wallet" },
        { title: "Upload Your First File", href: "#upload-file" },
        { title: "Understanding Encryption", href: "#encryption" }
      ]
    },
    {
      title: "Core Concepts",
      icon: Book,
      items: [
        { title: "IPFS & Decentralized Storage", href: "#ipfs" },
        { title: "Polkadot Blockchain", href: "#polkadot" },
        { title: "End-to-End Encryption", href: "#e2e-encryption" },
        { title: "File Versioning", href: "#versioning" }
      ]
    },
    {
      title: "Features",
      icon: FileText,
      items: [
        { title: "File Upload & Download", href: "#upload-download" },
        { title: "Sharing & Permissions", href: "#sharing" },
        { title: "Encryption Options", href: "#encryption-options" },
        { title: "Activity Tracking", href: "#activity" }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { title: "Encryption Standards", href: "#encryption-standards" },
        { title: "Key Management", href: "#key-management" },
        { title: "Backup & Recovery", href: "#backup-recovery" },
        { title: "Best Practices", href: "#best-practices" }
      ]
    },
    {
      title: "API Reference",
      icon: Code,
      items: [
        { title: "Authentication", href: "#api-auth" },
        { title: "Upload API", href: "#api-upload" },
        { title: "Download API", href: "#api-download" },
        { title: "File Management", href: "#api-files" }
      ]
    },
    {
      title: "CLI Tools",
      icon: Terminal,
      items: [
        { title: "Installation", href: "#cli-install" },
        { title: "Commands", href: "#cli-commands" },
        { title: "Configuration", href: "#cli-config" },
        { title: "Examples", href: "#cli-examples" }
      ]
    }
  ]

  return (
    <div className="min-h-screen dark:bg-black bg-white dark:text-white text-gray-900">
      {/* Header */}
      <header className="border-b dark:border-gray-900 border-gray-200 sticky top-0 z-40 dark:bg-black/80 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Book className="h-6 w-6 text-orange-500" />
              <h1 className="text-xl font-bold">ChainVault Documentation</h1>
            </div>
          </div>
          <Link href="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 dark:text-gray-500 text-gray-400" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg dark:bg-gray-950 bg-gray-50 dark:border-gray-800 border-gray-200 dark:text-white text-gray-900"
            />
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6 hover:border-orange-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Icon className="h-5 w-5 text-orange-500" />
                  </div>
                  <h2 className="text-lg font-semibold dark:text-white text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        className="flex items-center justify-between dark:text-gray-400 text-gray-600 dark:hover:text-white hover:text-gray-900 transition group"
                      >
                        <span className="text-sm font-medium">{item.title}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>

        {/* Quick Start Guide */}
        <div id="quick-start" className="mb-16">
          <h2 className="text-3xl font-bold mb-6 dark:text-white text-gray-900">Quick Start Guide</h2>
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-8">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-orange-500" />
                    Connect Your Wallet
                  </h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">
                    Connect your Polkadot wallet to get started. We support all major Polkadot wallets including Polkadot.js, Talisman, and SubWallet.
                  </p>
                  <Card className="dark:bg-black bg-gray-50 dark:border-gray-800 border-gray-200 p-4">
                    <code className="text-sm dark:text-green-400 text-green-600 font-mono">
                      // Click "Connect Wallet" button in the navigation<br />
                      // Select your preferred wallet extension<br />
                      // Approve the connection request
                    </code>
                  </Card>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 flex items-center gap-2">
                    <Upload className="h-5 w-5 text-orange-500" />
                    Upload Your Files
                  </h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">
                    Upload files securely with end-to-end encryption. Your files are encrypted locally before being uploaded to IPFS.
                  </p>
                  <Card className="dark:bg-black bg-gray-50 dark:border-gray-800 border-gray-200 p-4">
                    <code className="text-sm dark:text-blue-400 text-blue-600 font-mono">
                      1. Click the "Upload" button<br />
                      2. Select files from your device<br />
                      3. Enable encryption (recommended)<br />
                      4. Set a strong password<br />
                      5. Confirm upload
                    </code>
                  </Card>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-orange-500" />
                    Manage Encryption Keys
                  </h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">
                    Your encryption keys are stored locally. Make sure to backup your keys for file recovery.
                  </p>
                  <Card className="dark:bg-black bg-gray-50 dark:border-gray-800 border-gray-200 p-4">
                    <code className="text-sm dark:text-purple-400 text-purple-600 font-mono">
                      // Navigate to Settings → Encryption<br />
                      // Click "Export Key" to backup<br />
                      // Store your key in a secure location
                    </code>
                  </Card>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 flex items-center gap-2">
                    <Download className="h-5 w-5 text-orange-500" />
                    Access Your Files
                  </h3>
                  <p className="dark:text-gray-400 text-gray-600 mb-4">
                    View, download, and share your files from anywhere. Your files are always available on the decentralized network.
                  </p>
                  <Card className="dark:bg-black bg-gray-50 dark:border-gray-800 border-gray-200 p-4">
                    <code className="text-sm dark:text-yellow-400 text-yellow-600 font-mono">
                      // Browse your files in the dashboard<br />
                      // Click on any file to download<br />
                      // Enter decryption password if encrypted<br />
                      // Share files with others via CID
                    </code>
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 dark:text-white text-gray-900">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
              <Database className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">Decentralized Storage</h3>
              <p className="dark:text-gray-400 text-gray-600">
                Your files are stored on IPFS, a distributed peer-to-peer network that ensures your data is always available and censorship-resistant.
              </p>
            </Card>

            <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
              <Shield className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">End-to-End Encryption</h3>
              <p className="dark:text-gray-400 text-gray-600">
                Files are encrypted with AES-256, RSA-2048, or Hybrid encryption on your device before upload. Only you have access to your encryption keys.
              </p>
            </Card>

            <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
              <Lock className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">Blockchain Verification</h3>
              <p className="dark:text-gray-400 text-gray-600">
                File metadata and ownership are recorded on the Polkadot blockchain, providing immutable proof of storage and authenticity.
              </p>
            </Card>

            <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
              <Key className="h-8 w-8 text-orange-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2 dark:text-white text-gray-900">Self-Custody</h3>
              <p className="dark:text-gray-400 text-gray-600">
                You maintain complete control over your files and encryption keys. We never have access to your data or passwords.
              </p>
            </Card>
          </div>
        </div>

        {/* Support */}
        <Card className="dark:bg-gradient-to-r dark:from-orange-500/10 dark:to-purple-500/10 bg-gradient-to-r from-orange-50 to-purple-50 dark:border-orange-500/20 border-orange-200 p-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white text-gray-900">Need Help?</h2>
          <p className="dark:text-gray-300 text-gray-700 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold">
              Contact Support
            </Button>
            <Button variant="outline" className="dark:border-gray-700 border-gray-300 dark:text-white text-gray-900 font-medium">
              Join Community
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
