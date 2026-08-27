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
  title: 'ABSCONDED | Scriptorium by VYRM',
  description: 'VYRM Press: Limited-edition physical chapbooks and digital-first manuscripts from the cyber-existential Signal Collection by Tanvir Khan, featuring Absconded, Tethered, The Room Between Lives, and Silent Protocol.',
  authors: [{ name: 'Tanvir Khan' }],
  keywords: ['VYRM', 'vyrm.space', 'Digital Manuscript', 'Builder', 'Evolution', 'Internet', 'Mumbai', 'Essays', 'Book', 'Tethered', 'The Signal and the Stairs', 'The Room Between Lives', 'Silent Protocol', 'AI Sandboxing', 'Solana Trading', 'Web3', 'Memecoins', 'Tanvir Khan'],
  openGraph: {
    title: 'ABSCONDED | Scriptorium by VYRM',
    description: 'VYRM Press: Limited-edition physical chapbooks and digital-first manuscripts from the cyber-existential Signal Collection.',
    url: 'https://vyrm.space',
    siteName: 'VYRM',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYRM | Scriptorium & Cyber-Press',
    description: 'VYRM Press: Limited-edition physical chapbooks and digital-first manuscripts.',
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
    <html lang="en" suppressHydrationWarning className="selection:bg-white/10 selection:text-white" style={{ background: '#050505' }}>
      <head>
        {/* Blocking script: runs synchronously BEFORE paint to prevent white flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('absconded-theme');
                  // Only restore dark themes — never start as white/light on load
                  if (t === 'terminal') {
                    document.documentElement.setAttribute('data-theme', 'terminal');
                    document.documentElement.style.background = '#0a0f0d';
                  } else {
                    // Default to oled (dark) — resets any accidental light theme saves
                    document.documentElement.setAttribute('data-theme', 'oled');
                    document.documentElement.style.background = '#050505';
                    localStorage.setItem('absconded-theme', 'oled');
                  }
                } catch(e) {}
              })()
            `
          }}
        />
      </head>
      <body className="bg-bg text-text antialiased min-h-screen">
        <AppInit />
        {children}
        <Analytics />
      </body>
    </html>
  )
}


