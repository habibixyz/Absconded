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
  metadataBase: new URL('https://vyrm.space'),
  title: 'ABSCONDED | Scriptorium by VYRM & Universal Manuscript Reader',
  description: 'VYRM Press: Limited-edition physical chapbooks, digital manuscripts by Tanvir Khan, and The Universal Reader. Read 70,000+ public domain classics and private EPUB/TXT files in pure OLED minimalism.',
  authors: [{ name: 'Tanvir Khan', url: 'https://x.com/ritmir11' }],
  keywords: [
    'VYRM', 'vyrm.space', 'Digital Manuscript', 'Universal Reader', 'Read Any Book', 'EPUB Reader', 
    'Project Gutenberg', 'Public Domain Books', 'OLED Reader', 'Builder', 'Evolution', 'Internet', 
    'Mumbai', 'Essays', 'Book', 'Tethered', 'The Signal and the Stairs', 'Silent Protocol', 
    'The Room Between Lives', 'AI Sandboxing', 'Solana Trading', 'Web3', 'Memecoins', 'Tanvir Khan'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ABSCONDED | Scriptorium by VYRM & Universal Manuscript Reader',
    description: 'VYRM Press: Limited-edition physical chapbooks and digital-first manuscripts by Tanvir Khan, plus The Universal Reader to explore 70,000+ public domain classics in pure OLED minimalism.',
    url: 'https://vyrm.space',
    siteName: 'VYRM',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/absconded-cover.png',
        width: 1200,
        height: 630,
        alt: 'ABSCONDED - Scriptorium by VYRM & Universal Reader',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABSCONDED | Scriptorium by VYRM & Universal Manuscript Reader',
    description: 'VYRM Press: Limited-edition physical chapbooks and digital-first manuscripts by Tanvir Khan, plus The Universal Reader.',
    creator: '@ritmir11',
    images: ['/absconded-cover.png'],
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
  verification: {
    google: 'n7V338hKpXPWrDYQVhC7dvhVgLqRbjBjL2PmF1ytmq0',
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://vyrm.space/#website',
        'url': 'https://vyrm.space',
        'name': 'ABSCONDED Scriptorium by VYRM & Universal Reader',
        'description': 'A digital manuscript library, physical chapbook press, and distraction-free universal reading room.',
        'author': {
          '@type': 'Person',
          'name': 'Tanvir Khan',
          'url': 'https://x.com/ritmir11'
        }
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://vyrm.space/#webapp',
        'url': 'https://vyrm.space',
        'name': 'The Universal Reader',
        'applicationCategory': 'BooksApplication',
        'operatingSystem': 'All',
        'description': 'Read 70,000+ public domain classic books or private EPUB/TXT files in a distraction-free OLED reader.'
      }
    ]
  }

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
                  if (t === 'terminal') {
                    document.documentElement.setAttribute('data-theme', 'terminal');
                    document.documentElement.style.background = '#0a0f0d';
                  } else if (t === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.background = '#f8f5ee';
                  } else {
                    document.documentElement.setAttribute('data-theme', 'oled');
                    document.documentElement.style.background = '#050505';
                  }
                } catch(e) {}
              })()
            `
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
