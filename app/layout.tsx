import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from 'next/font/google'
import "./globals.css"
import { Navigation } from "@/components/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "THE DEN HOUSE",
  description: "Hip Hop, Soul & Jazz Lattice Studio",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#1a0b00] via-[#2d1b0e] to-[#0f0500] text-amber-50 min-h-screen`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  )
}
