import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AquaTodo - Your Personal Task Manager',
  description: 'A simple, responsive, and visually appealing Todo application with secure authentication and task management',
  openGraph: {
    title: 'AquaTodo - Your Personal Task Manager',
    description: 'A simple, responsive, and visually appealing Todo application with secure authentication and task management',
    type: 'website',
    siteName: 'AquaTodo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AquaTodo - Your Personal Task Manager',
    description: 'A simple, responsive, and visually appealing Todo application with secure authentication and task management',
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
        {children}
      </body>
    </html>
  )
}