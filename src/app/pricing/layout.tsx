import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing Plans - Flexible AI Automation for Every Team',
  description: 'Choose the perfect ZedAI plan for your team. Free plan with 500 credits, Pro at $29/month with 1000 credits, Premium at $99/month with 10,000 credits. Powerful AI agents, GitHub automation, and priority support. Start free today.',
  keywords: [
    'ZedAI pricing',
    'AI automation pricing',
    'development tools pricing',
    'GitHub automation cost',
    'AI agents pricing',
    'developer tools subscription',
    'continuous AI pricing',
    'free AI development tools',
    'affordable AI automation',
    'enterprise AI tools',
  ],
  openGraph: {
    title: 'ZedAI Pricing Plans - Flexible AI Automation for Every Team',
    description: 'Choose the perfect ZedAI plan. Free plan available. Pro at $29/month. Premium at $99/month. Powerful AI agents and automation tools for developers.',
    url: 'https://zedai.dev/pricing',
    type: 'website',
    images: [
      {
        url: '/images/zedai_ad.jpg',
        width: 1200,
        height: 630,
        alt: 'ZedAI Pricing Plans',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZedAI Pricing Plans - Flexible AI Automation for Every Team',
    description: 'Choose the perfect ZedAI plan. Free plan available. Pro at $29/month. Premium at $99/month.',
  },
  alternates: {
    canonical: 'https://zedai.dev/pricing',
  },
}

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
