import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - Start Your Free ZedAI Account',
  description: 'Create your free ZedAI account today. Get 500 free credits, access to AI automation tools, and GitHub integration. No credit card required. Start automating your development workflow in minutes.',
  keywords: [
    'ZedAI signup',
    'create AI account',
    'free AI tools',
    'developer account',
    'GitHub automation signup',
    'free development tools',
    'AI agents free trial',
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Sign Up - Start Your Free ZedAI Account',
    description: 'Create your free ZedAI account. Get 500 free credits and access to powerful AI automation tools. No credit card required.',
    url: 'https://zedai.dev/signup',
  },
  alternates: {
    canonical: 'https://zedai.dev/signup',
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
