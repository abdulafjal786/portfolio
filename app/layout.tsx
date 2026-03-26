import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Cursor from '@/components/Cursor'
import BackgroundAnimation from '@/components/BackgroundAnimations'

// Load Inter font with Next.js
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Abdul Afjal Ansari | Fullstack Developer',
  description: 'Portfolio of Abdul Afjal Ansari – Fullstack Developer with 3.6+ years of experience in React, Next.js, Django, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} cursor-none overflow-x-hidden bg-black text-white`}>
        <Cursor />
        <BackgroundAnimation />
        {children}
      </body>
    </html>
  )
}