import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - ZedAI',
  description: 'Learn about the team behind ZedAI and our mission to revolutionize software development with AI-powered tools.',
  keywords: 'ZedAI about, AI development team, software development mission, ZedAI values, tech company culture',
  openGraph: {
    title: 'About Us - ZedAI',
    description: 'Learn about the team behind ZedAI and our mission to revolutionize software development.',
    type: 'website',
  },
}

export default function AboutUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
