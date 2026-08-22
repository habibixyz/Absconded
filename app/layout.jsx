import './globals.css'
import AppInit from './components/AppInit'
import { Analytics } from '@vercel/analytics/next'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata = {
  title: 'ABSCONDED | A Builder\'s Evolution',
  description: 'A premium digital manuscript collection by Tanvir Khan, featuring Absconded, Tethered, and The Signal and the Stairs. A meditation on AI sandboxing, Web3 memecoins, ambition, fatherhood, and the process of becoming.',
  authors: [{ name: 'Tanvir Khan' }],
  keywords: ['Digital Manuscript', 'Builder', 'Evolution', 'Internet', 'Mumbai', 'Essays', 'Book', 'Tethered', 'The Signal and the Stairs', 'AI Sandboxing', 'Solana Trading', 'Web3', 'Memecoins', 'Tanvir Khan'],
  openGraph: {
    title: 'ABSCONDED | A Builder\'s Evolution',
    description: 'A premium digital manuscript collection by Tanvir Khan, featuring Absconded, Tethered, and The Signal and the Stairs.',
    url: 'https://absconded-book.vercel.app',
    siteName: 'ABSCONDED',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABSCONDED | A Builder\'s Evolution',
    description: 'A premium digital manuscript collection by Tanvir Khan, featuring Absconded, Tethered, and The Signal and the Stairs.',
    creator: '@ritmir11',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="selection:bg-white/10 selection:text-white">
      <body className="bg-bg text-text antialiased min-h-screen">
        <AppInit />
        {children}
        <Analytics />
      </body>
    </html>
  )
}


