'use client'

import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'
import { ArrowRight, Users, Zap, Heart, TrendingUp } from 'lucide-react'

export default function HiringPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      <main className="relative">
        {/* Logo and Brand Section */}
        <AnimatedSection className="text-center mt-8 mb-12">
          <div className="flex gap-3 justify-center items-center">
            <Image
              src="/zedai_logo.png"
              alt="ZedAI Logo"
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
              priority
              unoptimized
            />
            <span className="text-4xl font-bold text-gray-900">ZedAI</span>
          </div>
        </AnimatedSection>

        {/* Hero Section */}
        <AnimatedSection className="text-center px-4 mb-16" delay={100}>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900 animate-fade-in-up">
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Shape the Future of AI-Powered Development
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <AnimatedSection className="mb-16" delay={200}>
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                We're Hiring Passionate Developers
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p className="text-lg leading-relaxed">
                  At ZedAI, we're building the next generation of AI-powered development tools that empower developers worldwide.
                  We're looking for talented individuals who share our vision and are eager to contribute to something extraordinary.
                </p>

                <p className="text-lg leading-relaxed">
                  We believe that everyone deserves an opportunity to showcase their potential. Whether you're a seasoned professional
                  or an emerging talent, if you have the drive and passion to make a difference, we want to hear from you.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* What We're Looking For */}
          <AnimatedSection className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What We Value Most
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500 rounded-lg">
                    <Heart className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Passion & Willingness
                    </h3>
                    <p className="text-gray-700">
                      We prioritize your mindset and eagerness to learn over existing skills.
                      Your enthusiasm and dedication to growth matter most to us.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Growth Mindset
                    </h3>
                    <p className="text-gray-700">
                      Skills can be developed and refined. We're committed to helping you grow
                      professionally through mentorship and continuous learning opportunities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500 rounded-lg">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Team Collaboration
                    </h3>
                    <p className="text-gray-700">
                      We value team players who communicate effectively, share knowledge,
                      and contribute to a positive, inclusive work environment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500 rounded-lg">
                    <Zap className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Innovation Drive
                    </h3>
                    <p className="text-gray-700">
                      We seek creative problem-solvers who aren't afraid to challenge the status quo
                      and bring fresh perspectives to complex challenges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Our Process */}
          <AnimatedSection className="mb-16">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Our Hiring Process
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Initial Application</h3>
                    <p className="text-gray-700">
                      Submit your application through our contact form. Tell us about yourself, your interests,
                      and why you want to join ZedAI.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Technical Interview</h3>
                    <p className="text-gray-700">
                      We'll have a conversation about your technical background, problem-solving approach,
                      and discuss potential projects you'd work on.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Skills Assessment</h3>
                    <p className="text-gray-700">
                      A practical assessment to understand your current skill level and potential.
                      This helps us identify the best role and growth path for you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Fit Discussion</h3>
                    <p className="text-gray-700">
                      Meet with team members to ensure mutual alignment on values, work style,
                      and long-term goals.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Offer & Onboarding</h3>
                    <p className="text-gray-700">
                      If we're a great match, you'll receive a competitive offer and begin your journey
                      with comprehensive onboarding and mentorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Compensation & Benefits */}
          <AnimatedSection className="mb-16">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Compensation & Benefits
              </h2>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                <p className="text-lg leading-relaxed">
                  We believe in rewarding talent fairly and competitively. Our compensation packages are designed
                  to reflect your contributions and grow with your development:
                </p>

                <ul className="space-y-3 text-lg">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Competitive Salary:</strong> Market-rate compensation that reflects your skills and experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Performance Bonuses:</strong> Regular reviews with merit-based increases and bonuses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Professional Development:</strong> Budget for courses, conferences, and learning resources</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Flexible Work:</strong> Remote-friendly environment with flexible hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Health & Wellness:</strong> Comprehensive health benefits and wellness programs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span><strong>Equity Options:</strong> Opportunity to own a piece of ZedAI's future success</span>
                  </li>
                </ul>

                <p className="text-lg leading-relaxed font-semibold text-green-700 mt-6">
                  Rest assured, our compensation packages are designed to exceed your expectations and
                  reward your dedication to excellence.
                </p>
              </div>
            </div>
          </AnimatedSection>

          {/* CTA Section */}
          <AnimatedSection className="text-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-12 text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Join Us?
              </h2>
              <p className="text-xl mb-8 text-green-50">
                Don't hesitate to reach out. We're excited to learn about you and explore how we can grow together.
              </p>

              <Link href="/get-in-touch">
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg text-lg">
                  Contact Us Now
                  <ArrowRight size={20} />
                </button>
              </Link>

              <p className="mt-6 text-green-100 text-sm">
                We review all applications carefully and respond within 5 business days
              </p>
            </div>
          </AnimatedSection>
        </div>
      </main>

      <Footer />
    </div>
  )
}
