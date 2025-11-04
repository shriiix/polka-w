"use client"

import { Menu, Search, User, Wallet, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  // Mock wallet address - in real app, get from WalletContext
  const walletAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`

  return (
    <nav className="border-b dark:border-gray-900 border-gray-200 dark:bg-black/50 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <button onClick={onMenuClick} className="md:hidden p-2 dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg dark:text-white text-gray-900">
          <Menu size={20} />
        </button>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by file name or CID..."
              className="pl-10 dark:bg-gray-900/50 bg-gray-100 dark:border-gray-800 border-gray-300 dark:text-white text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="dark:border-gray-800 border-gray-300 dark:hover:bg-gray-900 hover:bg-gray-100 gap-2 dark:text-white text-gray-900 font-medium"
              >
                <Wallet size={18} className="text-orange-500" />
                <span className="hidden sm:inline text-sm font-mono">{truncatedAddress}</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="dark:bg-gray-950 bg-white dark:border-gray-900 border-gray-200 w-64">
              <div className="px-3 py-2">
                <p className="text-xs dark:text-gray-500 text-gray-500 mb-1 font-medium">Connected Wallet</p>
                <p className="text-sm font-mono dark:text-white text-gray-900 break-all">{walletAddress}</p>
              </div>
              <DropdownMenuSeparator className="dark:bg-gray-900 bg-gray-200" />
              <DropdownMenuItem className="dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-gray-900 cursor-pointer font-medium">
                <User className="h-4 w-4 mr-2" />
                View Account
              </DropdownMenuItem>
              <DropdownMenuItem className="dark:text-gray-300 text-gray-700 dark:hover:text-white hover:text-gray-900 cursor-pointer font-medium">
                <Wallet className="h-4 w-4 mr-2" />
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuSeparator className="dark:bg-gray-900 bg-gray-200" />
              <DropdownMenuItem className="text-red-400 hover:text-red-300 cursor-pointer font-medium">
                Disconnect Wallet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
