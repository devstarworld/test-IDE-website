'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { checkAuthState } from '@/actions/authActions'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import PaymentModal from '@/components/PaymentModal/PaymentModal'

export default function PricingPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('pro')

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  const getPlanAmount = (plan: 'free' | 'pro' | 'premium') => {
    const amounts = { free: 0, pro: 29, premium: 99 }
    return amounts[plan]
  }

  const handlePlanAction = (targetPlan: 'free' | 'pro' | 'premium') => {
    // If user is not logged in, redirect to login
    if (!user) {
      router.push('/login')
      return
    }

    // If user already has this plan, do nothing
    if (user.membership === targetPlan) {
      return
    }

    // Open payment modal
    setSelectedPlan(targetPlan)
    setIsPaymentModalOpen(true)
  }

  const getButtonText = (plan: 'free' | 'pro' | 'premium') => {
    if (!user) {
      if (plan === 'free') return 'Start Free Trial'
      if (plan === 'pro') return 'Upgrade to Pro'
      if (plan === 'premium') return 'Upgrade to Premium'
      return null
    }

    const currentPlan = user.membership

    // Same plan - don't show button
    if (currentPlan === plan) {
      return null
    }

    // Determine if upgrade or downgrade
    const planHierarchy: { [key: string]: number } = { free: 0, pro: 1, premium: 2 }
    const isUpgrade = planHierarchy[plan] > planHierarchy[currentPlan]

    if (plan === 'free') return 'Downgrade to Free'
    if (plan === 'pro') {
      return isUpgrade ? 'Upgrade to Pro' : 'Downgrade to Pro'
    }
    if (plan === 'premium') return 'Upgrade to Premium'
    
    return null
  }

  const shouldShowButton = (plan: 'free' | 'pro' | 'premium') => {
    if (!user) return true
    return user.membership !== plan
  }

  return (
    <>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        amount={getPlanAmount(selectedPlan)}
      />
      <div className="fixed inset-0 overflow-y-auto bg-continue-bg font-manrope">
        <div className="min-h-screen relative">
          <Navbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-600">
              Choose the plan that works best for your team
            </p>
            {user && (
              <p className="text-sm text-gray-500 mt-2">
                Current plan: <span className="font-semibold capitalize">{user.membership}</span>
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className={`relative bg-white rounded-lg shadow-lg p-8 border ${
              user?.membership === 'free' ? 'border-2 border-green-500' : ''
            }`}>
              {user?.membership === 'free' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  500 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic AI assistance
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Community support
                </li>
              </ul>
              {shouldShowButton('free') && (
                <button
                  onClick={() => handlePlanAction('free')}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {getButtonText('free')}
                </button>
              )}
            </div>

            {/* Pro Plan */}
            <div className={`bg-white rounded-lg shadow-lg p-8 relative ${
              user?.membership === 'pro' ? 'border-2 border-primary' : 'border-2 border-primary'
            }`}>
              {user?.membership === 'pro' ? (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              ) : (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1000 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced AI agents
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom integrations
                </li>
              </ul>
              {shouldShowButton('pro') && (
                <button
                  onClick={() => handlePlanAction('pro')}
                  disabled={isLoading}
                  className="btn-primary w-full py-2 px-4 rounded-md text-white disabled:opacity-50"
                >
                  {getButtonText('pro')}
                </button>
              )}
            </div>

            {/* Premium Plan */}
            <div className={`bg-white rounded-lg shadow-lg p-8 border ${
              user?.membership === 'premium' ? 'border-2 border-purple-500' : ''
            }`}>
              {user?.membership === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10000 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced AI agents
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  On-premise deployment
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Custom SLA
                </li>
              </ul>
              {shouldShowButton('premium') && (
                <button
                  onClick={() => handlePlanAction('premium')}
                  disabled={isLoading}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {getButtonText('premium')}
                </button>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
    </>
  )
}
