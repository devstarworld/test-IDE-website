'use client'

import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'
import Image from 'next/image'

export default function VideoSection() {
  return (
    <AnimatedSection className="relative z-10 max-w-4xl mx-auto sm:px-6 lg:px-8 pb-16" delay={200}>
      <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50 bg-white">
        <div className="relative w-full aspect-video flex items-center justify-center p-8">
          <Image
            src="/zedai_ad.jpg"
            alt="ZedAI Agent Interface"
            fill
            className="object-contain"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
            unoptimized
          />
        </div>
      </div>
    </AnimatedSection>
  )
}