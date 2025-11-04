"use client"

import { Upload, Download, Share2, Trash2, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

// Mock activity data
const mockActivityLog = [
  {
    id: "1",
    action: "upload",
    fileName: "Project Proposal.pdf",
    timestamp: new Date(Date.now() - 3600000),
    details: "File uploaded and encrypted",
  },
  {
    id: "2",
    action: "share",
    fileName: "Design System.figma",
    timestamp: new Date(Date.now() - 7200000),
    details: "Shared with 5E3C...9F8",
  },
  {
    id: "3",
    action: "download",
    fileName: "Presentation.pptx",
    timestamp: new Date(Date.now() - 86400000),
    details: "File downloaded",
  },
  {
    id: "4",
    action: "upload",
    fileName: "Budget 2024.xlsx",
    timestamp: new Date(Date.now() - 172800000),
    details: "File uploaded and encrypted",
  },
  {
    id: "5",
    action: "delete",
    fileName: "Old Draft.docx",
    timestamp: new Date(Date.now() - 259200000),
    details: "File permanently deleted",
  },
]

export default function ActivityPage() {
  const getActivityIcon = (action: string) => {
    switch (action) {
      case "upload":
        return <Upload className="h-4 w-4" />
      case "download":
        return <Download className="h-4 w-4" />
      case "share":
        return <Share2 className="h-4 w-4" />
      case "delete":
        return <Trash2 className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (action: string) => {
    switch (action) {
      case "upload":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "download":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "share":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "delete":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    }
  }

  const getActivityText = (action: string) => {
    switch (action) {
      case "upload":
        return "Uploaded"
      case "download":
        return "Downloaded"
      case "share":
        return "Shared"
      case "delete":
        return "Deleted"
      default:
        return action
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activity Log</h1>
          <p className="text-gray-400">Track all your file operations and activities</p>
        </div>

        {mockActivityLog.length === 0 ? (
          <Card className="bg-gray-950 border-gray-900 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="h-20 w-20 rounded-lg bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No activity yet</h3>
              <p className="text-gray-400">Your file operations will appear here</p>
            </div>
          </Card>
        ) : (
          <Card className="bg-gray-950 border-gray-900 overflow-hidden">
            <div className="divide-y divide-gray-900">
              {mockActivityLog.map((activity) => (
                <div key={activity.id} className="p-6 hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${getActivityColor(activity.action)}`}
                    >
                      {getActivityIcon(activity.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <Badge className={`${getActivityColor(activity.action)} border`}>
                          {getActivityText(activity.action)}
                        </Badge>
                        <span className="font-medium text-white truncate">{activity.fileName}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">{formatDate(activity.timestamp)}</p>
                        {activity.details && <p className="text-sm text-gray-500">{activity.details}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
