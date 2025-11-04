"use client"

import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  }

  const imageSizes = {
    sm: 32,
    md: 48,
    lg: 80
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl"
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Image */}
      <div className={`${sizeClasses[size]} rounded-2xl overflow-hidden flex items-center justify-center transition-transform hover:scale-105 relative`}>
        <Image 
          src="/chainvault-logo.svg"
          alt="ChainVault Logo"
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="object-cover"
          priority
        />
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight`}>
            ChainVault
          </span>
          {size !== "sm" && (
            <span className="text-xs text-gray-500 -mt-1">
              Decentralized Storage
            </span>
          )}
        </div>
      )}
    </div>
  )
}
