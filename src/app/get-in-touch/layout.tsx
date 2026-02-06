import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get in Touch - ZedAI',
  description: 'Contact the ZedAI team. Ready to discuss Continuous AI at your company? We would love to help your team get started.',
  keywords: 'contact ZedAI, get in touch, enterprise sales, ZedAI support, contact form',
  openGraph: {
    title: 'Get in Touch - ZedAI',
    description: 'Contact the ZedAI team for enterprise solutions and support.',
    type: 'website',
  },
}

export default function GetInTouchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
