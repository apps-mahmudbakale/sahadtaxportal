import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tax ID Collection Portal | Sahad Hospitals',
  description: 'Staff Tax ID Collection Portal for Sahad Hospitals - Update your National TIN and FCT-IRS Tax ID',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/sahad-logo.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/sahad-logo.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/sahad-logo.png',
    shortcut: '/sahad-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
