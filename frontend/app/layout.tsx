import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { WalletProvider } from "@/contexts/wallet-context"
import { PolkadotWalletProvider } from "@/contexts/polkadot-wallet-context"
import { StorageProvider } from "@/contexts/storage-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})
const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: "ChainVault - Decentralized Storage",
  description: "Secure, encrypted, decentralized file storage powered by IPFS and Polkadot. Your data, your control.",
  keywords: ["Web3", "IPFS", "Polkadot", "Decentralized Storage", "Encryption", "Blockchain"],
  authors: [{ name: "ChainVault Team" }],
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PolkadotWalletProvider>
            <WalletProvider>
              <StorageProvider>
                {children}
                <Toaster />
              </StorageProvider>
            </WalletProvider>
          </PolkadotWalletProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
