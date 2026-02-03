import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Continue • Ship faster with Continuous AI | Continue',
  description: "The future of coding isn't writing more code. It's delegating the boring parts, so you can build the interesting stuff.",
  keywords: 'AI agents,background agents,continuous AI,GitHub automation,Sentry automation,Snyk automation,Linear automation,cloud agents,development automation',
  authors: [{ name: 'Continue' }],
  creator: 'Continue',
  publisher: 'Continue',
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Continue',
    statusBarStyle: 'default',
  },

  openGraph: {
    title: 'Continue',
    description: 'Ship faster with Continuous AI. Launch background agents in seconds with battle-tested workflows for GitHub, Sentry, Snyk, and Linear. Customize prompts, models, and tools to fit your stack.',
    siteName: 'Continue',
    type: 'website',
    images: [
      {
        url: 'https://hub.continue.dev/opengraph-image?63efedb2e8c7609c',
        width: 1200,
        height: 630,
        alt: 'Continue',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Continue',
    description: "Ship faster with Continuous AI. The future of coding isn't writing more code. It's delegating the boring parts, so you can build the interesting stuff",
    images: ['https://hub.continue.dev/twitter-image?63efedb2e8c7609c'],
  },

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/footer-gradient.webp" />
        <script src="/animations.js" defer></script>
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}