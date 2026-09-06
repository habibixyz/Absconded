import './globals.css'
import AppInit from './components/AppInit'
import { Analytics } from '@vercel/analytics/next'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050505',
  viewportFit: 'cover',
}

const SITE_URL = 'https://vyrm.space'
const SITE_NAME = 'Absconded — Scriptorium by VYRM'
const AUTHOR = 'Tanvir Khan'
const TWITTER = '@ritmir11'

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: 'Absconded — Digital Manuscripts & Universal Reader | VYRM',
    template: '%s | Absconded by VYRM',
  },

  description:
    'A digital manuscript library by Tanvir Khan — builder, author, internet nomad from Mumbai. Read original cyber-existential novels and 70,000+ public domain classics in pure OLED minimalism. Free, forever.',

  applicationName: 'Absconded by VYRM',
  authors: [{ name: AUTHOR, url: `https://x.com/${TWITTER.slice(1)}` }],
  creator: AUTHOR,
  publisher: 'VYRM Press',
  category: 'Books & Reading',
  generator: 'Next.js',

  keywords: [
    // Brand
    'VYRM', 'vyrm.space', 'Absconded', 'Tanvir Khan',
    // Books
    'digital manuscripts', 'free books online', 'read books online free',
    'public domain books', 'Project Gutenberg reader', 'EPUB reader online',
    'Universal Reader', 'OLED book reader', 'distraction-free reading',
    // Titles
    'Absconded by Tanvir Khan', 'Tethered manuscript', 'Silent Protocol book',
    'The Room Between Lives', 'The Signal and the Stairs',
    'The Mask Beneath', 'The Trenches memecoin',
    // Topics
    'builder lifestyle', 'internet entrepreneur', 'crypto builder',
    'Mumbai writer', 'cyber thriller', 'AI fiction', 'Web3 essays',
    'success books free', 'mindset books', 'wealth classics',
    'As a Man Thinketh', 'Science of Getting Rich', 'Napoleon Hill',
    'philosophy books free', 'Stoicism online',
  ],

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Absconded — Digital Manuscripts & Universal Reader by Tanvir Khan',
    description:
      'Original cyber-existential novels by Tanvir Khan (Mumbai builder) + a distraction-free reader for 70,000+ public domain classics. Free. Beautiful. OLED-native.',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Absconded — Scriptorium by VYRM. Read original manuscripts and 70,000+ classics free.',
        type: 'image/png',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    site: TWITTER,
    creator: TWITTER,
    title: 'Absconded — Digital Manuscripts & Universal Reader',
    description:
      'Original novels by Tanvir Khan + 70,000+ public domain classics. Read free in pure OLED minimalism.',
    images: [`${SITE_URL}/og-image.png`],
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/icon.png', sizes: '512x512' }],
    shortcut: '/favicon.ico',
  },

  manifest: '/manifest.json',

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'n7V338hKpXPWrDYQVhC7dvhVgLqRbjBjL2PmF1ytmq0',
  },
}

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // 1. WebSite with SearchAction (enables Google Sitelinks Search Box)
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        'A digital manuscript library, physical chapbook press, and distraction-free universal reading room by Tanvir Khan.',
      inLanguage: 'en-US',
      publisher: {
        '@id': `${SITE_URL}/#person`,
      },
    },

    // 2. Person — Tanvir Khan
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Tanvir Khan',
      url: SITE_URL,
      sameAs: [
        'https://x.com/ritmir11',
        'https://github.com/habibixyz/Absconded',
      ],
      jobTitle: 'Author & Builder',
      description:
        'Mumbai-based builder and author. Writes cyber-existential fiction, essays on AI, crypto, and identity formation in the internet era.',
      knowsAbout: [
        'Web3', 'AI', 'Solana', 'Creative Writing', 'Digital Publishing',
        'Supply Chain', 'Entrepreneurship',
      ],
    },

    // 3. WebApplication — Universal Reader
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#reader`,
      url: SITE_URL,
      name: 'The Universal Reader',
      applicationCategory: 'BooksApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript',
      description:
        'A distraction-free reading engine. Read 70,000+ public domain classics from Project Gutenberg or upload your own EPUB, TXT, and Markdown files. 100% client-side and private.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    },

    // 4. Original Books (Book schema for each manuscript)
    {
      '@type': 'Book',
      '@id': `${SITE_URL}/#book-absconded`,
      name: 'Absconded',
      url: SITE_URL,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@type': 'Organization', name: 'VYRM Press' },
      datePublished: '2026-05-17',
      inLanguage: 'en',
      genre: ['Autofiction', 'Essays', 'Builder Memoir'],
      description:
        'The story of a builder unravelling from the corporate timeline in Mumbai. Tracing a transition from stable retail procurement to crypto speculation, AI experimentation, and internet-native identity.',
      bookFormat: 'EBook',
      isAccessibleForFree: true,
    },
    {
      '@type': 'Book',
      '@id': `${SITE_URL}/#book-silent-protocol`,
      name: 'Silent Protocol',
      url: SITE_URL,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@type': 'Organization', name: 'VYRM Press' },
      datePublished: '2026-08-23',
      inLanguage: 'en',
      genre: ['Thriller', 'Tech Fiction', 'Corporate Drama'],
      description:
        'A high-stakes tech-thriller set at Meridian House during a Category-5 cyclone. Nine guests face an algorithmic reckoning for covering up a fatal AI error.',
      bookFormat: 'EBook',
      isAccessibleForFree: true,
    },
    {
      '@type': 'Book',
      '@id': `${SITE_URL}/#book-room-between-lives`,
      name: 'The Room Between Lives',
      url: SITE_URL,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@type': 'Organization', name: 'VYRM Press' },
      datePublished: '2026-08-27',
      inLanguage: 'en',
      genre: ['Literary Fiction', 'Psychological Drama', 'Mystery'],
      description:
        'A four-book novel about Wren Calloway who checks into a hotel between lives — a coma-space where she must live four alternate existences to find the courage to wake up.',
      bookFormat: 'EBook',
      isAccessibleForFree: true,
    },
    {
      '@type': 'Book',
      '@id': `${SITE_URL}/#book-the-trenches`,
      name: 'The Trenches: A Builder\'s Guide to Memecoin Survival',
      url: SITE_URL,
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@type': 'Organization', name: 'VYRM Press' },
      datePublished: '2026-08-18',
      inLanguage: 'en',
      genre: ['Non-Fiction', 'Crypto', 'Finance', 'Builder Memoir'],
      description:
        'A raw, unfiltered builder\'s field guide to surviving, failing, and finding signal in the chaos of Solana memecoin markets.',
      bookFormat: 'EBook',
      isAccessibleForFree: true,
    },

    // 5. BreadcrumbList for key sections
    {
      '@type': 'BreadcrumbList',
      '@id': `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'The Signal Collection',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'The Universal Reader',
          item: `${SITE_URL}/#reader`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'The Storehouse',
          item: `${SITE_URL}/#storehouse`,
        },
      ],
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="selection:bg-white/10 selection:text-white"
      style={{ background: '#050505' }}
    >
      <head>
        {/* ── Blocking theme script: runs before paint to prevent flash ── */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('absconded-theme');if(t==='terminal'){document.documentElement.setAttribute('data-theme','terminal');document.documentElement.style.background='#0a0f0d';}else if(t==='light'){document.documentElement.setAttribute('data-theme','light');document.documentElement.style.background='#f8f5ee';}else{document.documentElement.setAttribute('data-theme','oled');document.documentElement.style.background='#050505';}}catch(e){}})()`,
          }}
        />

        {/* ── Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── Preconnect for performance ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.gutenberg.org" />
        <link rel="dns-prefetch" href="https://gutendex.com" />
      </head>
      <body className="bg-bg text-text antialiased min-h-screen">
        <AppInit />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
