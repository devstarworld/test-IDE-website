import { Metadata } from 'next'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'GitHub Agent | Continue',
  description: 'Keep AGENTS.md up to date with new Pull Requests',
}

export default function GitHubAgentPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Image
            src="/images/integrations/github.svg"
            alt="GitHub"
            width={80}
            height={80}
            className="mx-auto mb-6 opacity-70"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub Agent
          </h1>
          <p className="text-xl text-gray-600">
            Keep AGENTS.md up to date with new Pull Requests
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <h2>Overview</h2>
          <p>
            The GitHub agent automatically maintains your AGENTS.md file by tracking 
            new pull requests and updating documentation to reflect the latest changes 
            in your agent configurations and workflows.
          </p>

          <h2>Key Features</h2>
          <ul>
            <li>Automatic AGENTS.md updates on PR merge</li>
            <li>Smart detection of agent-related changes</li>
            <li>Maintains consistent documentation format</li>
            <li>Integrates with your existing GitHub workflow</li>
          </ul>

          <h2>How it works</h2>
          <ol>
            <li>Monitors your repository for new pull requests</li>
            <li>Analyzes changes for agent-related modifications</li>
            <li>Automatically updates AGENTS.md with relevant information</li>
            <li>Creates a follow-up commit with documentation updates</li>
          </ol>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Pro Tip:</strong> The agent works best when you follow consistent 
                  naming conventions for your agent files and include descriptive commit messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}