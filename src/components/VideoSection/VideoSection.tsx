'use client'

import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function VideoSection() {
  return (
    <AnimatedSection className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16" delay={200}>
      <div className="rounded-xl overflow-hidden shadow-2xl border border-border/50">
        <div 
          style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem'
          }}
        />
      </div>
    </AnimatedSection>
  )
}