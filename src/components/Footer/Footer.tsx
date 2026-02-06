'use client'

import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function Footer() {
  return (
    <AnimatedSection className="relative border-t bg-muted/20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <Image
          src="/images/footer-gradient.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-50 noise-overlay" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex justify-between mb-12">
          <div>
            <Link href="/" className="inline-block mb-3 -ml-4">
              <Image
                src="/images/zedai_logo.png"
                alt="ZedAI"
                width={168}
                height={56}
                className="h-14 w-auto"
                style={{ width: 'auto', height: '56px' }}
              />
            </Link>
            
            <p className="text-muted-foreground italic mb-6 text-lg">
              Ship as fast as you can code
            </p>
            
            <div className="flex gap-x-16">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/pricing"
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
              
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Link
                    href="/about-us"
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  >
                    About Us
                  </Link>
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                  >
                    We&apos;re hiring!
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <a
                    href=""
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-muted-foreground transition-colors"
                  >
                    ZedAI, Inc.
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t gap-4">
          <div className="text-sm text-muted-foreground">© 2026 ZedAI, Inc.</div>
          
          <div className="flex gap-6">
            <a
              href="https://www.linkedin.com/company/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 448 512"
                className="w-5 h-5"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
              </svg>
            </a>
          
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}