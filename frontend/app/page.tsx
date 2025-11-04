"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { usePolkadotWallet } from "@/contexts/polkadot-wallet-context"
import { shortenAddress } from "@/lib/polkadot"
import { 
  Menu, 
  X, 
  Shield, 
  Wallet, 
  Lock, 
  Cloud, 
  Zap, 
  Users, 
  FileCheck,
  Globe,
  Database,
  Key,
  CheckCircle2,
  ArrowRight,
  Github,
  Twitter,
  Brain,
  Award,
  BarChart3,
  LogOut
} from "lucide-react"
import { motion } from "framer-motion"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const router = useRouter()
  const { account, isConnected, disconnect } = usePolkadotWallet()

  const handleConnectWallet = () => {
    if (isConnected) {
      router.push("/dashboard")
    } else {
      setWalletModalOpen(true)
    }
  }

  const handleWalletSuccess = () => {
    setWalletModalOpen(false)
    router.push("/dashboard")
  }

  const handleDisconnect = () => {
    disconnect()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-900 sticky top-0 z-40 bg-black/80 backdrop-blur-sm relative overflow-hidden">
        {/* Animated top line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-slide-line" />
        
        {/* Animated bottom light effect */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] overflow-hidden">
          <motion.div
            className="h-full w-32 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
            animate={{
              x: ['-128px', 'calc(100vw + 128px)'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Features
            </a>
            <a href="#security" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Security
            </a>
            <a href="/docs" className="text-gray-400 hover:text-white transition text-sm font-medium">
              Docs
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isConnected && account ? (
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-mono text-gray-300">
                      {shortenAddress(account.address, 4)}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleDisconnect}
                  variant="ghost"
                  className="text-gray-400 hover:text-white gap-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleConnectWallet}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-900 p-4 space-y-4">
            <a href="#features" className="block text-gray-400 hover:text-white text-sm font-medium">
              Features
            </a>
            <a href="#security" className="block text-gray-400 hover:text-white text-sm font-medium">
              Security
            </a>
            <a href="/docs" className="block text-gray-400 hover:text-white text-sm font-medium">
              Docs
            </a>
            {isConnected && account ? (
              <>
                <div className="px-4 py-3 rounded-lg bg-gray-900 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-gray-300">
                      {shortenAddress(account.address, 4)}
                    </span>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                >
                  Dashboard
                </Button>
                <Button 
                  onClick={handleDisconnect}
                  variant="outline"
                  className="w-full border-gray-800 text-gray-400 hover:text-white rounded-lg gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleConnectWallet}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg gap-2"
              >
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                Web3 Cloud
                <br />
                Backup Service
                <br />
                <span className="text-orange-500">Your data, your control.</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Decentralized & Encrypted Backup using IPFS + Polkadot. Upload, store, and securely share your files with on-chain accessibility.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleConnectWallet}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg text-base gap-2"
              >
                {isConnected ? (
                  <>
                    <ArrowRight className="h-5 w-5" />
                    Go to Dashboard
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    Get Started
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border border-gray-700 text-white hover:bg-gray-900/50 px-8 py-3 rounded-lg text-base bg-transparent"
              >
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative w-72 h-72">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-3xl blur-3xl" />

              {/* Icon container */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-3xl blur-2xl" />
                  <div className="relative bg-gradient-to-br from-orange-500/5 to-orange-600/5 border border-orange-500/30 rounded-3xl p-12 flex items-center justify-center">
                    <Shield size={100} className="text-orange-400" strokeWidth={1} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-900 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-sm text-gray-400">Decentralized</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">AES-256</div>
              <div className="text-sm text-gray-400">Encryption</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">0</div>
              <div className="text-sm text-gray-400">Middlemen</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">∞</div>
              <div className="text-sm text-gray-400">Storage</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
            Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need for
            <br />
            <span className="text-orange-500">secure file storage</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built on cutting-edge Web3 technology with enterprise-grade security
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Lock,
              title: "End-to-End Encryption",
              description: "Files are encrypted locally with AES-256 before upload. Only you hold the keys.",
              color: "orange"
            },
            {
              icon: Cloud,
              title: "IPFS Storage",
              description: "Distributed storage across the IPFS network ensures your data is always accessible.",
              color: "blue"
            },
            {
              icon: Shield,
              title: "Blockchain Security",
              description: "File metadata stored on Polkadot blockchain for immutable records and verification.",
              color: "purple"
            },
            {
              icon: Users,
              title: "Secure Sharing",
              description: "Share files with encrypted access control. Only authorized wallets can decrypt.",
              color: "green"
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              description: "Optimized IPFS integration for quick uploads and downloads with CDN-like speed.",
              color: "yellow"
            },
            {
              icon: Key,
              title: "Your Keys, Your Data",
              description: "Non-custodial solution. We never have access to your encryption keys or files.",
              color: "red"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-950 border-gray-900 p-6 h-full hover:border-orange-500/50 transition-all group">
                <div className={`h-12 w-12 rounded-lg bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-950/50 border-y border-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple, Secure, <span className="text-orange-500">Decentralized</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                icon: Wallet,
                title: "Connect Wallet",
                description: "Link your Polkadot wallet via browser extension"
              },
              {
                step: "02",
                icon: Lock,
                title: "Encrypt Files",
                description: "Files encrypted locally with your password"
              },
              {
                step: "03",
                icon: Cloud,
                title: "Upload to IPFS",
                description: "Distributed storage across decentralized network"
              },
              {
                step: "04",
                icon: FileCheck,
                title: "On-Chain Record",
                description: "Metadata stored on blockchain for verification"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 mb-4">
                    <step.icon className="h-8 w-8 text-orange-400" />
                  </div>
                  <div className="text-orange-500 font-bold text-sm mb-2">{step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-orange-500/50 to-transparent -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section - NEW */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
            Advanced Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Next-Gen Web3
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Storage Innovation</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powered by AI, blockchain, and cutting-edge technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 border-purple-500/30 p-8 h-full hover:border-purple-500/60 transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Intelligent file analysis with automatic classification, security scoring, and optimization recommendations.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Content classification & tagging</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Security risk assessment</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Storage optimization insights</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-pink-500/5 to-pink-600/5 border-pink-500/30 p-8 h-full hover:border-pink-500/60 transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="h-8 w-8 text-pink-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">NFT Certificates</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Mint your files as NFTs for proof of ownership, royalty earnings, and global marketplace access.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Immutable proof of ownership</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Automatic royalty system</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-pink-500 flex-shrink-0 mt-0.5" />
                  <span>Trade on major NFT platforms</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-cyan-500/5 to-cyan-600/5 border-cyan-500/30 p-8 h-full hover:border-cyan-500/60 transition-all group">
              <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">Real-Time Analytics</h3>
              <p className="text-gray-400 leading-relaxed mb-4">
                Comprehensive dashboard with insights, metrics, and multi-chain statistics for your files.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>Storage usage analytics</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>Activity monitoring & logs</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <span>Multi-chain performance tracking</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">
              Security First
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Bank-level security
              <br />
              <span className="text-orange-500">meets Web3</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Your files are protected by military-grade encryption, decentralized storage, and blockchain verification.
            </p>

            <div className="space-y-4">
              {[
                "Client-side AES-256 encryption",
                "Zero-knowledge architecture",
                "Immutable blockchain records",
                "Distributed IPFS storage",
                "Non-custodial key management"
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-orange-500 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-orange-500/5 to-orange-600/5 border border-orange-500/30 rounded-3xl p-12">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-950 border-gray-800 p-4">
                  <Database className="h-8 w-8 text-orange-500 mb-2" />
                  <div className="text-2xl font-bold text-white">IPFS</div>
                  <div className="text-xs text-gray-400">Distributed</div>
                </Card>
                <Card className="bg-gray-950 border-gray-800 p-4">
                  <Globe className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold text-white">Polkadot</div>
                  <div className="text-xs text-gray-400">Blockchain</div>
                </Card>
                <Card className="bg-gray-950 border-gray-800 p-4">
                  <Lock className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold text-white">AES-256</div>
                  <div className="text-xs text-gray-400">Encryption</div>
                </Card>
                <Card className="bg-gray-950 border-gray-800 p-4">
                  <Key className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-2xl font-bold text-white">Your Keys</div>
                  <div className="text-xs text-gray-400">Non-custodial</div>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-y border-orange-500/20">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to take control of
              <br />
              <span className="text-orange-500">your data?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join the decentralized storage revolution. No signup required, just connect your wallet.
            </p>
            <Button
              onClick={handleConnectWallet}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-6 rounded-lg text-lg gap-2 group"
            >
              <Wallet className="h-5 w-5" />
              Connect Wallet & Start
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" showText={true} className="mb-4" />
              <p className="text-gray-400 text-sm">
                Decentralized encrypted storage on IPFS & Polkadot
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white text-sm transition">Features</a>
                <a href="#security" className="block text-gray-400 hover:text-white text-sm transition">Security</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <div className="space-y-2">
                <a href="#docs" className="block text-gray-400 hover:text-white text-sm transition">Documentation</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition">API</a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition">Support</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Community</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2025 ChainVault. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Wallet Connect Modal */}
      <WalletConnectModal 
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSuccess={handleWalletSuccess}
      />
    </div>
  )
}
