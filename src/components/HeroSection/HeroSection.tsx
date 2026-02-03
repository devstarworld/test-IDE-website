'use client'

import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 section-animate" style={{opacity: 0, filter: 'blur(12px)'}}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
          Ship as fast as<br />you can code
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed">
          Writing code got 10x faster. Shipping it didn&apos;t. Continue closes the gap—your team&apos;s rules, defined in code, enforced on every pull request.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/signup">
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed bg-primary border-primary hover:bg-primary/90 active:scale-[0.98] h-10 rounded-xl px-8 py-6 text-lg border-0 shadow-sm hover:shadow-md active:shadow-sm text-white" style={{backgroundColor: 'rgb(31, 136, 61)'}}>
              Get started
            </button>
          </Link>
          
          <a
            href="https://docs.continue.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted active:bg-muted/80 h-10 rounded-xl px-8 py-6 text-lg">
              Learn more →
            </button>
          </a>
        </div>
      </div>
    </section>
  )
}