import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Access Your ZedAI Account',
  description: 'Sign in to your ZedAI account to access powerful AI automation tools. Manage your continuous AI agents, GitHub workflows, and development automation. Secure login with Google and GitHub.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://zedai.dev/login',
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
