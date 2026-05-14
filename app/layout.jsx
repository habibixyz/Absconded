import './globals.css'
import AppInit from './components/AppInit'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export const metadata = {
  title: 'ABSCONDED | A Builder\'s Evolution',
  description: 'A premium digital manuscript by Tanvir Khan. A meditation on internet, ambition, and the process of becoming.',
  authors: [{ name: 'Tanvir Khan' }],
  keywords: ['Digital Manuscript', 'Builder', 'Evolution', 'Internet', 'Mumbai', 'Essays', 'Book'],
  openGraph: {
    title: 'ABSCONDED | A Builder\'s Evolution',
    description: 'A premium digital manuscript by Tanvir Khan.',
    url: 'https://absconded.vercel.app',
    siteName: 'ABSCONDED',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABSCONDED | A Builder\'s Evolution',
    description: 'A premium digital manuscript by Tanvir Khan.',
    creator: '@ritmir11',
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="selection:bg-white/10 selection:text-white">
      <body className="bg-bg text-text antialiased min-h-screen">
        <AppInit />
        {children}
      </body>
    </html>
  )
}


