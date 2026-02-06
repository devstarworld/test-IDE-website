'use client'

import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'
import Image from 'next/image'

export default function AboutUsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About ZedAI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We&apos;re building the future of software development with AI agents that understand your codebase and enforce your team&apos;s standards.
          </p>
        </AnimatedSection>

        {/* Mission Section */}
        <AnimatedSection className="grid gap-12 items-center mb-20" delay={100}>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-4">
              The future of coding isn&apos;t writing more code. It&apos;s delegating the boring parts, so you can build the interesting stuff.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              ZedAI bridges the gap between writing code and shipping it by automating code reviews, enforcing standards, and catching issues before they reach production.
            </p>
            <p className="text-lg text-gray-600">
              We believe every team should have access to the same level of code quality and consistency that the best engineering teams enjoy.
            </p>
          </div>
        </AnimatedSection>

        {/* Values Section */}
        <div className="mb-20">
          <AnimatedSection delay={200}>
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection className="text-center" delay={300}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Speed</h3>
              <p className="text-gray-600">
                We help teams ship faster by automating the tedious parts of code review and quality assurance.
              </p>
            </AnimatedSection>
            
            <AnimatedSection className="text-center" delay={400}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                Every line of code should meet your team&apos;s standards. We make sure it does, automatically.
              </p>
            </AnimatedSection>
            
            <AnimatedSection className="text-center" delay={500}>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">
                Great software is built by great teams. We help teams work together more effectively.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* Backers Section */}
        <AnimatedSection className="bg-gray-50 rounded-lg p-12 text-center" delay={600}>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Backed by the best</h2>
          <p className="text-lg text-gray-600 mb-8">
            We&apos;re proud to be supported by leading investors who believe in our vision.
          </p>
          <div className="flex justify-center items-center space-x-12">
            <Image
              src="/images/backers/y-combinator.svg"
              alt="Y Combinator"
              width={120}
              height={40}
              className="h-10 w-auto opacity-70"
              unoptimized
            />
            <Image
              src="/images/backers/heavybit.svg"
              alt="Heavybit"
              width={120}
              height={40}
              className="h-10 w-auto opacity-70"
              unoptimized
            />
          </div>
        </AnimatedSection>
      </div>
      <Footer />
    </>
  )
}