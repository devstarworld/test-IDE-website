import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/store/ReduxProvider'
import { FirebaseProvider } from '@/contexts/FirebaseContext'
import AppInitializer from '@/components/AppInitializer'
import NavigationLoader from '@/components/NavigationLoader/NavigationLoader'

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
  metadataBase: new URL('https://zedai.dev'),
  title: {
    default: 'ZedAI - AI-Powered Development Automation Platform | Continuous AI Agents',
    template: '%s | ZedAI - AI Development Platform'
  },
  description: "Transform your development workflow with ZedAI's continuous AI agents. Automate GitHub, Sentry, Snyk, and Linear workflows in seconds. Deploy intelligent background agents with battle-tested prompts, custom models, and powerful tools. Boost productivity by 10x with AI-driven automation.",
  keywords: [
    // Primary Keywords
    'AI development platform',
    'continuous AI agents',
    'AI automation tools',
    'development automation',
    'AI coding assistant',
    
    // Feature Keywords
    'GitHub automation',
    'Sentry automation',
    'Snyk automation',
    'Linear automation',
    'background AI agents',
    'intelligent code agents',
    
    // Use Case Keywords
    'DevOps automation',
    'CI/CD automation',
    'code review automation',
    'bug tracking automation',
    'security scanning automation',
    
    // Technology Keywords
    'AI agents',
    'machine learning automation',
    'cloud agents',
    'workflow automation',
    'developer productivity tools',
    
    // Long-tail Keywords
    'automate development workflow',
    'AI powered code review',
    'continuous integration AI',
    'automated bug detection',
    'intelligent development tools',
    
    // Brand
    'ZedAI',
    'Zed AI platform',
    'ZedAI agents'
  ],
  authors: [{ name: 'ZedAI Team', url: 'https://zedai.dev' }],
  creator: 'ZedAI',
  publisher: 'ZedAI Inc.',
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' }
    ],
    shortcut: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'ZedAI',
    statusBarStyle: 'default',
  },
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zedai.dev',
    title: 'ZedAI - AI-Powered Development Automation Platform',
    description: 'Transform your development workflow with ZedAI\'s continuous AI agents. Automate GitHub, Sentry, Snyk, and Linear workflows. Deploy intelligent background agents with battle-tested prompts and boost productivity by 10x.',
    siteName: 'ZedAI',
    images: [
      {
        url: '/images/zedai_ad.jpg',
        width: 1200,
        height: 630,
        alt: 'ZedAI - Continuous AI Development Automation Platform',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZedAI - AI-Powered Development Automation Platform',
    description: "Transform your development workflow with ZedAI's continuous AI agents. Automate GitHub, Sentry, Snyk, and Linear workflows. Deploy intelligent background agents and boost productivity by 10x.",
    images: ['/images/zedai_ad.jpg'],
    creator: '@zedai',
    site: '@zedai',
  },
  alternates: {
    canonical: 'https://zedai.dev',
  },
  category: 'technology',
  classification: 'Software Development Tools',
  other: {
    'google-site-verification': 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enhanced JSON-LD structured data for better SEO
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ZedAI',
    url: 'https://zedai.dev',
    logo: 'https://zedai.dev/images/zedai-logo.png',
    description: 'AI-powered development automation platform for continuous integration and deployment',
    sameAs: [
      'https://twitter.com/',
      'https://github.com/',
      'https://linkedin.com/company/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@zedai.dev',
    },
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ZedAI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web, Windows, macOS, Linux',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '99',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: '0',
          priceCurrency: 'USD',
          description: '500 credits, Basic AI assistance, Community support',
        },
        {
          '@type': 'Offer',
          name: 'Pro Plan',
          price: '29',
          priceCurrency: 'USD',
          description: '1000 credits, Advanced AI agents, Priority support, Custom integrations',
        },
        {
          '@type': 'Offer',
          name: 'Premium Plan',
          price: '99',
          priceCurrency: 'USD',
          description: '10000 credits, Advanced AI agents, Dedicated support, On-premise deployment, Custom SLA',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '3750',
      bestRating: '5',
      worstRating: '2',
    },
    description: 'Speed up your development with Continuous AI. Deploy background agents in seconds with battle-tested workflows across GitHub, Sentry, Snyk, and Linear.',
    url: 'https://zedai.dev',
    screenshot: 'https://zedai.dev/images/zedai_ad.jpg',
    author: {
      '@type': 'Organization',
      name: 'ZedAI',
    },
    featureList: [
      'GitHub Automation',
      'Sentry Integration',
      'Snyk Security Scanning',
      'Linear Project Management',
      'Custom AI Agents',
      'Background Processing',
      'Real-time Monitoring',
      'Workflow Automation',
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://zedai.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Pricing',
        item: 'https://zedai.dev/pricing',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Account',
        item: 'https://zedai.dev/account',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is ZedAI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZedAI is an AI-powered development automation platform that helps teams deploy continuous AI agents for GitHub, Sentry, Snyk, and Linear workflows. It automates repetitive tasks and boosts developer productivity.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does ZedAI improve development workflow?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZedAI deploys intelligent background agents that automate code reviews, bug tracking, security scanning, and project management tasks. This allows developers to focus on writing code while AI handles routine operations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What integrations does ZedAI support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'ZedAI integrates with GitHub for code management, Sentry for error tracking, Snyk for security scanning, and Linear for project management. More integrations are continuously being added.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there a free plan available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, ZedAI offers a free plan with 500 credits, basic AI assistance, and community support. Perfect for individual developers and small projects.',
        },
      },
    ],
  }

  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" as="image" href="/images/footer-gradient.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Structured Data - Multiple schemas for rich snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Geo targeting */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        
        {/* Language */}
        <meta httpEquiv="content-language" content="en-US" />
      </head>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.className}`}>
        <ReduxProvider>
          <FirebaseProvider>
            <AppInitializer />
            <NavigationLoader />
            {children}
          </FirebaseProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
