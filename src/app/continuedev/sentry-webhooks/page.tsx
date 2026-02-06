import { Metadata } from 'next'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sentry Agent | ZedAI',
  description: 'Automatically open pull requests to address Sentry alerts',
}

export default function SentryWebhooksPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Image
            src="/images/integrations/sentry.svg"
            alt="Sentry"
            width={80}
            height={80}
            className="mx-auto mb-6 opacity-70"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sentry Agent
          </h1>
          <p className="text-xl text-gray-600">
            Automatically open pull requests to address Sentry alerts
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <h2>How it works</h2>
          <p>
            The Sentry agent monitors your error tracking and automatically creates pull requests 
            to fix issues when they occur. It analyzes the error context, stack traces, and 
            affected code to propose targeted fixes.
          </p>

          <h2>Features</h2>
          <ul>
            <li>Automatic error detection and analysis</li>
            <li>Smart fix suggestions based on error context</li>
            <li>Integration with your existing PR workflow</li>
            <li>Customizable alert thresholds</li>
          </ul>

          <h2>Setup</h2>
          <p>
            To get started with the Sentry agent, you&apos;ll need to configure your Sentry webhook 
            to point to ZedAI&apos;s endpoint and provide your repository access tokens.
          </p>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h3>Configuration Example</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "webhook_url": "https://ZedAI.dev/webhooks/sentry",
  "repository": "your-org/your-repo",
  "alert_threshold": "error",
  "auto_create_pr": true
}`}
            </pre>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}