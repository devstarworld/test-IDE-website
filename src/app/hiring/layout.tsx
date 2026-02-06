import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Our Team - ZedAI Careers',
  description: 'Join ZedAI and help shape the future of AI-powered development tools. We\'re looking for passionate developers who want to make a difference.',
  keywords: 'ZedAI careers, developer jobs, AI jobs, software engineer positions, tech careers, join our team',
  openGraph: {
    title: 'Join Our Team - ZedAI Careers',
    description: 'Join ZedAI and help shape the future of AI-powered development tools.',
    type: 'website',
  },
}

export default function HiringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
