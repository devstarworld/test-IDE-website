'use client'

import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function CTASection() {
  return (
    <AnimatedSection className="pt-12 pb-24" delay={500}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-card text-card-foreground shadow-sm bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-2">
          <div className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to discuss Continuous AI at your company?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8">
              We can help your team get started
            </p>
            
            <Link href="/get-in-touch">
              <button className="btn-primary">
                Get in touch
              </button>
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}