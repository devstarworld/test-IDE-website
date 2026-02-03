'use client'

import Image from 'next/image'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function IntegrationsSection() {
  const integrations = [
    {
      name: 'Sentry',
      logo: '/images/integrations/sentry.svg',
      description: 'Open pull requests to address alerts automatically',
      link: '/continuedev/sentry-webhooks'
    },
    {
      name: 'Snyk',
      logo: '/images/integrations/snyk.svg',
      description: 'Fix dependency vulnerabilities automatically',
      link: '/continuedev/snyk-webhooks'
    },
    {
      name: 'Sanity',
      logo: '/images/integrations/sanity.svg',
      description: 'Manage CMS content schema documentation automatically',
      link: '/continuedev/sanity-schema-docs'
    },
    {
      name: 'Netlify',
      logo: '/images/integrations/netlify.svg',
      description: 'Run audits on PRs and production to compare performance',
      link: '/continuedev/netlify-website-optimizer'
    },
    {
      name: 'GitHub',
      logo: '/images/integrations/github.svg',
      description: 'Keep AGENTS.md up to date with new Pull Requests',
      link: '/continuedev/agentsmd-updater'
    },
    {
      name: 'PostHog',
      logo: '/images/integrations/posthog.svg',
      description: 'Update dashboards whenever telemetry is updated',
      link: '/continuedev/posthog-dashboard-updater'
    },
    {
      name: 'Atlassian',
      logo: '/images/integrations/atlassian.svg',
      description: 'Add a summary comment that explains the business value of a merged PR',
      link: '/continuedev/jira-ticket-updater'
    },
    {
      name: 'Supabase',
      logo: '/images/integrations/supabase.svg',
      description: 'Ensure databases follow security best practices automatically',
      link: '/continuedev/supabase-rls-policies'
    }
  ]

  return (
    <AnimatedSection className="pt-12 pb-24" delay={400}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Works with your favorite tools</h2>
          <p className="text-muted-foreground text-lg">
            Pre-built integrations and MCP support for the tools you already use
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex flex-col items-center text-center p-6">
              <Image
                src={integration.logo}
                alt={integration.name}
                width={40}
                height={40}
                className="h-10 w-auto mb-4 opacity-70"
                style={{ width: 'auto', height: '40px' }}
              />
              
              <h3 className="text-xl font-semibold mb-2">{integration.name}</h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {integration.description}
              </p>
              
              <Link
                href={integration.link}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                {integration.name} agent
                <span className="text-xs">↗︎</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  )
}