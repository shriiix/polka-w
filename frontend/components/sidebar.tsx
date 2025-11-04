"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Files, Share2, Settings, LogOut, BarChart3, Users, Brain, Award, Activity } from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const menuItems = [
    { href: "/dashboard", label: "My Files", icon: Files },
    { href: "/dashboard/shared-with-me", label: "Shared With Me", icon: Users },
    { href: "/dashboard/shared", label: "Shared Links", icon: Share2 },
    { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard/ai-analysis", label: "AI Analysis", icon: Brain },
    { href: "/dashboard/nft-mint", label: "NFT Mint", icon: Award },
    { href: "/dashboard/activity", label: "Activity Log", icon: Activity },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = () => {
    if (typeof window !== 'undefined' && confirm("Disconnect your Polkadot wallet?")) {
      // Clear session and navigate to home
      router.push("/")
    }
  }

  return (
    <aside
      className={cn(
        "bg-gray-950 border-r border-gray-900 transition-all duration-300 flex flex-col",
        open ? "w-64" : "w-20",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-900 flex items-center justify-between">
        {open ? (
          <Logo size="sm" showText={true} />
        ) : (
          <Logo size="sm" showText={false} />
        )}
        <button onClick={onToggle} className="p-1 hover:bg-gray-900 rounded-lg transition ml-auto">
          {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                isActive
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-900/50",
              )}
            >
              <Icon size={20} />
              {open && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-900">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900/50 transition w-full"
        >
          <LogOut size={20} />
          {open && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
