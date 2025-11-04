"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  PieChart,
  Activity,
  Zap,
  HardDrive,
  Upload,
  Download,
  Users,
  Globe,
  Shield,
  Clock
} from "lucide-react"
import { motion } from "framer-motion"

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Storage Used",
      value: "47.3 GB",
      change: "+12.3%",
      trend: "up",
      icon: HardDrive,
      color: "text-blue-500",
      bgColor: "dark:bg-blue-500/10 bg-blue-100"
    },
    {
      title: "Files Uploaded",
      value: "1,247",
      change: "+8.2%",
      trend: "up",
      icon: Upload,
      color: "text-green-500",
      bgColor: "dark:bg-green-500/10 bg-green-100"
    },
    {
      title: "Active Shares",
      value: "89",
      change: "+23.1%",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
      bgColor: "dark:bg-purple-500/10 bg-purple-100"
    },
    {
      title: "Avg. Response Time",
      value: "142ms",
      change: "-15.4%",
      trend: "down",
      icon: Zap,
      color: "text-yellow-500",
      bgColor: "dark:bg-yellow-500/10 bg-yellow-100"
    }
  ]

  const recentActivity = [
    { action: "File uploaded", file: "project-docs.pdf", time: "2 mins ago", type: "upload" },
    { action: "File shared", file: "presentation.pptx", time: "15 mins ago", type: "share" },
    { action: "File downloaded", file: "backup-2024.zip", time: "1 hour ago", type: "download" },
    { action: "Security scan", file: "all files", time: "2 hours ago", type: "security" },
    { action: "File encrypted", file: "financials.xlsx", time: "3 hours ago", type: "security" }
  ]

  const storageByType = [
    { type: "Documents", size: "18.5 GB", percentage: 39, color: "bg-blue-500" },
    { type: "Images", size: "14.2 GB", percentage: 30, color: "bg-green-500" },
    { type: "Videos", size: "10.8 GB", percentage: 23, color: "bg-purple-500" },
    { type: "Others", size: "3.8 GB", percentage: 8, color: "bg-yellow-500" }
  ]

  const chainStats = [
    { chain: "Polkadot", transactions: 342, status: "active", color: "text-pink-500" },
    { chain: "Ethereum", transactions: 128, status: "active", color: "text-blue-500" },
    { chain: "IPFS", uploads: 1247, status: "healthy", color: "text-cyan-500" }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold dark:text-white text-gray-900 flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-purple-500" />
          Analytics Dashboard
        </h1>
        <p className="dark:text-gray-400 text-gray-600 mt-2">
          Real-time insights and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`${stat.trend === 'up' ? 'dark:bg-green-500/10 bg-green-100 dark:text-green-400 text-green-700' : 'dark:bg-red-500/10 bg-red-100 dark:text-red-400 text-red-700'}`}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold dark:text-white text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm dark:text-gray-400 text-gray-600">
                  {stat.title}
                </p>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Storage Distribution */}
        <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            Storage Distribution
          </h2>
          <div className="space-y-4">
            {storageByType.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="dark:text-gray-300 text-gray-700 font-medium">{item.type}</span>
                  <span className="dark:text-gray-400 text-gray-600 text-sm">{item.size}</span>
                </div>
                <div className="w-full dark:bg-gray-900 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className={`h-full ${item.color}`}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-xs dark:text-gray-500 text-gray-500">{item.percentage}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
          <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg dark:bg-gray-900 bg-gray-50 dark:border-gray-800 border-gray-200 border"
              >
                <div className={`p-2 rounded-lg ${
                  activity.type === 'upload' ? 'dark:bg-green-500/10 bg-green-100' :
                  activity.type === 'share' ? 'dark:bg-purple-500/10 bg-purple-100' :
                  activity.type === 'download' ? 'dark:bg-blue-500/10 bg-blue-100' :
                  'dark:bg-yellow-500/10 bg-yellow-100'
                }`}>
                  {activity.type === 'upload' && <Upload className="h-4 w-4 text-green-500" />}
                  {activity.type === 'share' && <Users className="h-4 w-4 text-purple-500" />}
                  {activity.type === 'download' && <Download className="h-4 w-4 text-blue-500" />}
                  {activity.type === 'security' && <Shield className="h-4 w-4 text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <p className="dark:text-white text-gray-900 font-medium">{activity.action}</p>
                  <p className="dark:text-gray-400 text-gray-600 text-sm">{activity.file}</p>
                </div>
                <span className="text-xs dark:text-gray-500 text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Blockchain Stats */}
      <Card className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 p-6">
        <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-6 flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-500" />
          Multi-Chain Statistics
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {chainStats.map((chain, index) => (
            <motion.div
              key={chain.chain}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg dark:bg-gray-900 bg-gray-50 dark:border-gray-800 border-gray-200 border"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold ${chain.color}`}>{chain.chain}</h3>
                <Badge variant="secondary" className="dark:bg-green-500/10 bg-green-100 dark:text-green-400 text-green-700">
                  {chain.status}
                </Badge>
              </div>
              <p className="text-2xl font-bold dark:text-white text-gray-900">
                {chain.transactions || chain.uploads}
              </p>
              <p className="text-sm dark:text-gray-400 text-gray-600 mt-1">
                {chain.transactions ? 'Transactions' : 'Uploads'}
              </p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Performance Insights */}
      <Card className="dark:bg-gradient-to-r dark:from-purple-500/10 dark:to-pink-500/10 bg-gradient-to-r from-purple-50 to-pink-50 dark:border-purple-500/20 border-purple-200 p-6">
        <h2 className="text-xl font-semibold dark:text-white text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-purple-500" />
          Performance Insights
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold dark:text-white text-gray-900 mb-2">99.9%</div>
            <p className="dark:text-gray-400 text-gray-600">Uptime</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold dark:text-white text-gray-900 mb-2">142ms</div>
            <p className="dark:text-gray-400 text-gray-600">Avg Response</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold dark:text-white text-gray-900 mb-2">5.2GB/s</div>
            <p className="dark:text-gray-400 text-gray-600">Transfer Speed</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
