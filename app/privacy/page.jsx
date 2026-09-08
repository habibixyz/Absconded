import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy & Terms | VYRM',
  description: 'Privacy policy, cookies, and terms of service for Absconded and VYRM Scriptorium.',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#d4d4d4] px-6 py-16 max-w-3xl mx-auto font-sans leading-relaxed">
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center text-xs tracking-widest text-[#a3a3a3] hover:text-white uppercase transition-colors mb-6"
        >
          ← Back to Scriptorium
        </Link>
        <h1 className="text-3xl font-serif font-bold text-white tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-[#737373] tracking-widest uppercase">Last updated: September 2026</p>
      </div>

      <div className="space-y-8 text-sm text-[#a3a3a3]">
        <section>
          <h2 className="text-base font-semibold text-white mb-2">1. Overview</h2>
          <p>
            Welcome to <strong>Absconded / VYRM</strong> (accessible from <code className="text-white">vyrm.space</code>). We value your privacy.
            This Privacy Policy explains what information is collected and how it is used.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">2. Data Collection & Reader Privacy</h2>
          <p>
            Our Universal Reader is designed with a privacy-first architecture. Any custom files (EPUB, TXT, MD) you open in the reader
            are processed entirely on your local device. We do not store, read, or transmit your private uploaded documents to any server.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">3. Google AdSense & Third-Party Cookies</h2>
          <p className="mb-3">
            We use <strong>Google AdSense</strong> to display advertisements to help support our free digital publishing platform.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Google, as a third-party vendor, uses cookies to serve ads on our site.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline"
              >
                Google Ads Settings
              </a>
              {' '}or through{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 hover:underline"
              >
                AboutAds.info
              </a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">4. Analytics</h2>
          <p>
            We use minimal, privacy-conscious analytics (such as Vercel Analytics) to monitor aggregate traffic trends, page views, and reader performance without storing personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">5. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, you can reach out via X/Twitter at{' '}
            <a
              href="https://x.com/ritmir11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:underline"
            >
              @ritmir11
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
