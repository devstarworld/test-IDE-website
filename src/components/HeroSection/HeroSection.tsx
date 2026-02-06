'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function HeroSection() {
  return (
    <AnimatedSection className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16" delay={100}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
          Ship as fast as<br />you can code
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed">
          Writing code got 10x faster. Shipping it didn&apos;t. ZedAI closes the gap—your team&apos;s rules, defined in code, enforced on every pull request.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <button className="btn-primary">
              Get started
            </button>
          </Link>
          
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-secondary">
              Learn more →
            </button>
          </a>
        </div>
      </div>
    </AnimatedSection>
  )
}