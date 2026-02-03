'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="pt-12 pb-24 section-animate" style={{opacity: 0, filter: 'blur(12px)'}}>
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
              <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed bg-primary border-primary hover:bg-primary/90 active:scale-[0.98] h-10 rounded-xl px-8 py-6 text-lg border-0 shadow-sm hover:shadow-md active:shadow-sm text-white" style={{backgroundColor: 'rgb(31, 136, 61)'}}>
                Get in touch
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}