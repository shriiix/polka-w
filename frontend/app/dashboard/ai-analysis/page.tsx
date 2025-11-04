"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  Sparkles, 
  FileText, 
  Image, 
  Video, 
  Music,
  Shield,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  BarChart3
} from "lucide-react"
import { motion } from "framer-motion"

export default function AIAnalysisPage() {
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  const aiInsights = [
    {
      type: "security",
      icon: Shield,
      title: "Security Score: 98/100",
      description: "Your files are highly secure with AES-256 encryption",
      status: "excellent",
      color: "text-green-400"
    },
    {
      type: "optimization",
      icon: Zap,
      title: "Storage Optimization",
      description: "23% storage can be saved by deduplication",
      status: "good",
      color: "text-blue-400"
    },
    {
      type: "content",
      icon: Brain,
      title: "Content Classification",
      description: "Documents: 45%, Images: 30%, Videos: 15%, Others: 10%",
      status: "info",
      color: "text-purple-400"
    },
    {
      type: "risk",
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "2 files detected with potential duplicate content",
      status: "warning",
      color: "text-yellow-400"
    }
  ]

  const fileAnalysis = [
    {
      name: "Project_Proposal.pdf",
      type: "document",
      icon: FileText,
      aiScore: 95,
      tags: ["Business", "Confidential", "High Priority"],
      insights: "Contains sensitive financial data. Encryption strength: High"
    },
    {
      name: "Design_Mockups.png",
      type: "image",
      icon: Image,
      aiScore: 88,
      tags: ["Design", "UI/UX", "Draft"],
      insights: "High resolution image. Recommended for NFT minting"
    },
    {
      name: "Demo_Video.mp4",
      type: "video",
      icon: Video,
      aiScore: 92,
      tags: ["Media", "Marketing", "Public"],
      insights: "Optimized for streaming. IPFS retrieval: Fast"
    }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-500" />
            AI-Powered Analysis
          </h1>
          <p className="dark:text-gray-400 text-gray-600 mt-2">
            Get intelligent insights about your files with advanced AI analysis
          </p>
        </div>
        <Button 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold gap-2"
        >
          {analyzing ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      {/* Analysis Progress */}
      {analyzing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="dark:text-white text-gray-900 font-medium">Processing files...</span>
                <span className="dark:text-gray-400 text-gray-600 text-sm">67%</span>
              </div>
              <Progress value={67} className="h-2" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs dark:text-gray-400 text-gray-600">Classification</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <p className="text-xs dark:text-gray-400 text-gray-600">Security Scan</p>
                </div>
                <div className="text-center">
                  <Sparkles className="h-6 w-6 text-purple-500 mx-auto mb-2 animate-pulse" />
                  <p className="text-xs dark:text-gray-400 text-gray-600">AI Insights</p>
                </div>
                <div className="text-center opacity-50">
                  <Info className="h-6 w-6 dark:text-gray-600 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs dark:text-gray-400 text-gray-600">Reporting</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* AI Insights */}
      {analysisComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <motion.div
                  key={insight.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg dark:bg-gray-900 bg-gray-100">
                        <Icon className={`h-6 w-6 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold dark:text-white text-gray-900 mb-1">
                          {insight.title}
                        </h3>
                        <p className="text-sm dark:text-gray-400 text-gray-600">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* File Analysis */}
          <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Detailed File Analysis
            </h2>
            <div className="space-y-4">
              {fileAnalysis.map((file, index) => {
                const Icon = file.icon
                return (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }}
                    className="p-4 rounded-lg dark:bg-gray-900 bg-gray-50 dark:border-gray-800 border-gray-200 border"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-purple-500" />
                        <div>
                          <h4 className="font-medium dark:text-white text-gray-900">{file.name}</h4>
                          <p className="text-sm dark:text-gray-400 text-gray-600 mt-1">{file.insights}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="dark:bg-purple-500/10 bg-purple-100 dark:text-purple-400 text-purple-700 font-semibold">
                        {file.aiScore}/100
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {file.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="dark:border-gray-700 border-gray-300 dark:text-gray-300 text-gray-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="dark:bg-gradient-to-r dark:from-purple-500/10 dark:to-pink-500/10 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-purple-500/20 border-purple-200 p-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              AI Recommendations
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="dark:text-gray-300 text-gray-700">
                  Consider using Hybrid (AES + RSA) encryption for financial documents
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="dark:text-gray-300 text-gray-700">
                  Enable versioning for frequently updated design files
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="dark:text-gray-300 text-gray-700">
                  Mint NFT certificates for high-value digital assets
                </span>
              </li>
            </ul>
          </Card>
        </motion.div>
      )}

      {/* Initial State */}
      {!analyzing && !analysisComplete && (
        <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-12 text-center">
          <Brain className="h-16 w-16 text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold dark:text-white text-gray-900 mb-2">
            Ready to Analyze Your Files
          </h3>
          <p className="dark:text-gray-400 text-gray-600 mb-6">
            Our AI will scan your files and provide intelligent insights about security, optimization, and content classification
          </p>
          <Button 
            onClick={handleAnalyze}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Start AI Analysis
          </Button>
        </Card>
      )}
    </div>
  )
}
