"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Sparkles, 
  Award,
  FileText,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  Copy,
  ExternalLink,
  Palette,
  Shield,
  TrendingUp
} from "lucide-react"
import { motion } from "framer-motion"

export default function NFTCertificatePage() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [nftData, setNftData] = useState({
    name: "",
    description: "",
    royalty: "5"
  })

  const files = [
    {
      id: "1",
      name: "Digital_Artwork.png",
      type: "image",
      icon: ImageIcon,
      size: "2.4 MB",
      ipfsHash: "QmX7...9aB2"
    },
    {
      id: "2",
      name: "Music_Track.mp3",
      type: "audio",
      icon: Video,
      size: "5.1 MB",
      ipfsHash: "QmY8...3cD4"
    },
    {
      id: "3",
      name: "Certificate.pdf",
      type: "document",
      icon: FileText,
      size: "156 KB",
      ipfsHash: "QmZ9...7eF6"
    }
  ]

  const handleMint = () => {
    setMinting(true)
    setTimeout(() => {
      setMinting(false)
      setMinted(true)
    }, 3000)
  }

  const mintedNFT = {
    tokenId: "0x1A2B3C4D5E6F...",
    contract: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chain: "Polkadot",
    marketplace: "https://opensea.io/assets/...",
    ipfs: `ipfs://${files.find(f => f.id === selectedFile)?.ipfsHash}`,
    minted: "2024-10-29",
    owner: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
          <Award className="h-8 w-8 text-purple-500" />
          NFT Certificate Minting
        </h1>
        <p className="dark:text-gray-400 text-gray-600 mt-2">
          Convert your files into unique NFT certificates on the blockchain
        </p>
      </div>

      {!minted ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* File Selection */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="h-5 w-5 text-purple-500" />
              Select File to Mint
            </h2>
            <div className="space-y-3">
              {files.map((file) => {
                const Icon = file.icon
                return (
                  <motion.div
                    key={file.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedFile(file.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedFile === file.id
                        ? "dark:border-purple-500 border-purple-500 dark:bg-purple-500/10 bg-purple-50"
                        : "dark:border-gray-800 border-gray-200 dark:bg-gray-900 bg-gray-50 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedFile === file.id
                          ? "dark:bg-purple-500/20 bg-purple-100"
                          : "dark:bg-gray-800 bg-gray-200"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          selectedFile === file.id ? "text-purple-500" : "dark:text-gray-400 text-gray-600"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium dark:text-white text-gray-900">{file.name}</h4>
                        <p className="text-sm dark:text-gray-400 text-gray-600">{file.size} • {file.ipfsHash}</p>
                      </div>
                      {selectedFile === file.id && (
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          {/* NFT Metadata */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              NFT Metadata
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                  NFT Name
                </label>
                <Input
                  placeholder="My Awesome NFT"
                  value={nftData.name}
                  onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                  className="dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  placeholder="Describe your NFT..."
                  value={nftData.description}
                  onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                  className="dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-300 min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-2">
                  Royalty Percentage
                </label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  value={nftData.royalty}
                  onChange={(e) => setNftData({ ...nftData, royalty: e.target.value })}
                  className="dark:bg-gray-900 bg-white dark:border-gray-800 border-gray-300"
                />
                <p className="text-xs dark:text-gray-400 text-gray-600 mt-1">
                  Percentage you'll receive from secondary sales
                </p>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleMint}
                  disabled={!selectedFile || !nftData.name || minting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold gap-2"
                >
                  {minting ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Minting NFT...
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4" />
                      Mint NFT Certificate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Success Message */}
          <Card className="dark:bg-gradient-to-r dark:from-green-500/10 dark:to-emerald-500/10 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-500/20 border-green-200 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold dark:text-white text-gray-900 mb-2">
              NFT Successfully Minted! 🎉
            </h2>
            <p className="dark:text-gray-400 text-gray-600">
              Your file has been immortalized on the blockchain
            </p>
          </Card>

          {/* NFT Details */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              NFT Certificate Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg dark:bg-gray-900 bg-gray-50">
                <span className="dark:text-gray-400 text-gray-600">Token ID</span>
                <div className="flex items-center gap-2">
                  <code className="dark:text-white text-gray-900 font-mono text-sm">{mintedNFT.tokenId}</code>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg dark:bg-gray-900 bg-gray-50">
                <span className="dark:text-gray-400 text-gray-600">Contract Address</span>
                <div className="flex items-center gap-2">
                  <code className="dark:text-white text-gray-900 font-mono text-sm">{mintedNFT.contract.slice(0, 20)}...</code>
                  <Button size="sm" variant="ghost">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg dark:bg-gray-900 bg-gray-50">
                <span className="dark:text-gray-400 text-gray-600">Blockchain</span>
                <Badge variant="secondary" className="dark:bg-pink-500/10 bg-pink-100 dark:text-pink-400 text-pink-700">
                  {mintedNFT.chain}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg dark:bg-gray-900 bg-gray-50">
                <span className="dark:text-gray-400 text-gray-600">IPFS Location</span>
                <div className="flex items-center gap-2">
                  <code className="dark:text-white text-gray-900 font-mono text-sm">{mintedNFT.ipfs}</code>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg dark:bg-gray-900 bg-gray-50">
                <span className="dark:text-gray-400 text-gray-600">Minted Date</span>
                <span className="dark:text-white text-gray-900">{mintedNFT.minted}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white gap-2">
                <ExternalLink className="h-4 w-4" />
                View on OpenSea
              </Button>
              <Button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white gap-2">
                <TrendingUp className="h-4 w-4" />
                List for Sale
              </Button>
            </div>
          </Card>

          {/* Benefits */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4">
              Benefits of NFT Certificates
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-semibold dark:text-white text-gray-900 mb-1">Proof of Ownership</h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">Immutable blockchain record</p>
              </div>
              <div className="text-center p-4">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="font-semibold dark:text-white text-gray-900 mb-1">Royalty Earnings</h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">Earn from secondary sales</p>
              </div>
              <div className="text-center p-4">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold dark:text-white text-gray-900 mb-1">Global Marketplace</h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">Trade on major NFT platforms</p>
              </div>
            </div>
          </Card>

          <Button
            onClick={() => {
              setMinted(false)
              setSelectedFile(null)
              setNftData({ name: "", description: "", royalty: "5" })
            }}
            variant="outline"
            className="w-full"
          >
            Mint Another NFT
          </Button>
        </motion.div>
      )}
    </div>
  )
}
