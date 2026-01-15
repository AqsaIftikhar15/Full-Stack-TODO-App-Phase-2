import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastProvider } from '../components/ui/ToastProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AquaTodo - Your Personal Task Manager',
  description: 'All in one app to keep you daily life organized',
  openGraph: {
    title: 'AquaTodo - Your Personal Task Manager',
    description: 'All in one app to keep you daily life organized',
    type: 'website',
    siteName: 'AquaTodo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaTodo - Your Personal Task Manager',
    description: 'All in one app to keep you daily life organized',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-bluish-50 to-purplish-50 min-h-screen`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}