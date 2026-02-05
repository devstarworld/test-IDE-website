import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/store/ReduxProvider'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import AppInitializer from '@/components/AppInitializer'

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
  title: 'ZedAI • Speed up your development with Continuous AI | ZedAI',
  description: "Speed up your development with Continuous AI. Deploy background agents in seconds with battle-tested workflows across GitHub, Sentry, Snyk, and Linear. Customize prompts, models, and tools to fit your workflow.",
  keywords: 'AI agents,background agents,continuous AI,GitHub automation,Sentry automation,Snyk automation,Linear automation,cloud agents,development automation',
  authors: [{ name: 'ZedAI' }],
  creator: 'ZedAI',
  publisher: 'ZedAI',
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'ZedAI',
    statusBarStyle: 'default',
  },

  openGraph: {
    title: 'ZedAI',
    description: 'Speed up your development with Continuous AI. Deploy background agents in seconds with battle-tested workflows across GitHub, Sentry, Snyk, and Linear. Customize prompts, models, and tools to fit your workflow.',
    siteName: 'ZedAI',
    type: 'website',
    images: [
      {
        url: 'https://drive.google.com/file/d/1LIXVxqNkipx2fwjJW-wi56WDGjjnfQUf/view?usp=sharing',
        width: 1200,
        height: 630,
        alt: 'ZedAI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZedAI',
    description: "Speed up your development with Continuous AI. Deploy background agents in seconds with battle-tested workflows across GitHub, Sentry, Snyk, and Linear. Customize prompts, models, and tools to fit your workflow",
    images: ['https://drive.google.com/file/d/1LIXVxqNkipx2fwjJW-wi56WDGjjnfQUf/view?usp=sharing'],
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
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <ReduxProvider>
          <FirebaseProvider>
            <AppInitializer />
            {children}
          </FirebaseProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}