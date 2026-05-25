import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'College Discovery Platform',
  description: 'Find and compare colleges for your future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="text-xl font-bold text-blue-600">
                🎓 CollegeDiscovery
              </Link>
              <div className="flex gap-6">
                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/compare" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Compare
                </Link>
                <Link href="/saved" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Saved
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}