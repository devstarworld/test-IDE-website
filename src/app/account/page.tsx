'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { checkAuthState, logoutUser } from '@/actions/authActions'
import PaymentModal from '@/components/PaymentModal/PaymentModal'
import { Footer, Navbar, StripedBackground } from '@/components'
import { Download, Copy, User, Check } from 'lucide-react'

export default function AccountPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('pro')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const getPlanAmount = (plan: 'free' | 'pro' | 'premium') => {
    const amounts = { free: 0, pro: 29, premium: 99 }
    return amounts[plan]
  }

  const handlePlanAction = (targetPlan: 'free' | 'pro' | 'premium') => {
    if (!user || user.membership === targetPlan) {
      return
    }
    setSelectedPlan(targetPlan)
    setIsPaymentModalOpen(true)
  }

  const getButtonText = (plan: 'free' | 'pro' | 'premium') => {
    if (!user) return null
    
    const currentPlan = user.membership
    if (currentPlan === plan) return null

    const planHierarchy: { [key: string]: number } = { free: 0, pro: 1, premium: 2 }
    const isUpgrade = planHierarchy[plan] > planHierarchy[currentPlan]

    if (plan === 'free') return 'Downgrade to Free'
    if (plan === 'pro') return isUpgrade ? 'Upgrade to Pro' : 'Downgrade to Pro'
    if (plan === 'premium') return 'Upgrade to Premium'
    
    return null
  }

  const shouldShowButton = (plan: 'free' | 'pro' | 'premium') => {
    if (!user) return true
    return user.membership !== plan
  }

  const getTotalCredits = (membership: string) => {
    const credits = { free: 500, pro: 1000, premium: 10000 }
    return credits[membership as keyof typeof credits] || 500
  }

  const getResetDate = () => {
    if (!user) return ''
    const memberDate = new Date(user.memberSince)
    const nextMonth = new Date(memberDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return nextMonth.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
  }

  const handleCopyCurl = () => {
    navigator.clipboard.writeText('curl -fsSL https://cli.zedai.dev/install | bash')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(0_0%_95.3%)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalCredits = getTotalCredits(user.membership)
  const usedCredits = user.creditUsage
  const creditPercentage = Math.min((usedCredits / totalCredits) * 100, 100)

  return (
    <>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        amount={getPlanAmount(selectedPlan)}
      />
      
      <div className="min-h-screen bg-[hsl(0_0%_95.3%)] font-manrope">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Install Zedai Section */}
          <StripedBackground className="p-6 sm:p-8 mb-6 border border-border/50">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
              <Download className="w-5 h-5 mr-2" />
              Install Zedai
            </h2>
            
            <p className="text-gray-700 mb-4">
              Install Zedai IDE
            </p>
            <button
              className="bg-purple-600 text-white px-6 py-2.5 rounded-full font-medium mb-6 inline-flex items-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download for Windows
            </button>
            <p className="text-gray-700 mb-3">
              Install Zedai CLI in your terminal
            </p>
            
            <div className="bg-purple-100 border border-purple-300 rounded-lg px-4 py-3 font-mono text-sm text-purple-900 inline-flex items-center">
              <span className="select-all">curl -fsSL https://cli.zedai.dev/install | bash</span>
              <button 
                onClick={handleCopyCurl}
                className="ml-3 text-purple-600 hover:text-purple-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </StripedBackground>

          {/* Estimated Usage Section */}
          <StripedBackground className="p-6 mb-8 border border-border/50">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Estimated Usage</h3>
                <p className="text-sm text-gray-600">resets on {getResetDate()}</p>
              </div>
              <span className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm font-medium">
                Zedai {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)}
              </span>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-700">Credits</span>
                <span className="text-gray-600">{usedCredits} used / {totalCredits} covered in plan</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div 
                  className="bg-gray-600 h-2 rounded-full transition-all" 
                  style={{ width: `${creditPercentage}%` }}
                />
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {Math.round(creditPercentage)}%
              </div>
            </div>
          </StripedBackground>

          {/* Membership Plans */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Membership Plans
            </h2>
            <p className="text-gray-600">
              Upgrade or change your membership plan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <StripedBackground className={`p-8 border ${
              user.membership === 'free' ? 'border-2 border-green-500' : 'border-border/50'
            }`}>
              {user.membership === 'free' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  500 credits
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Basic AI assistance
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Community support
                </li>
              </ul>
              {shouldShowButton('free') && (
                <button
                  onClick={() => handlePlanAction('free')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  {getButtonText('free')}
                </button>
              )}
            </StripedBackground>

            {/* Pro Plan */}
            <StripedBackground className={`p-8 border relative ${
              user.membership === 'pro' ? 'border-2 border-primary' : 'border-2 border-primary'
            }`}>
              {user.membership === 'pro' ? (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Current Plan
                  </span>
                </div>
              ) : (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  1000 credits
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Advanced AI agents
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Priority support
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Custom integrations
                </li>
              </ul>
              {shouldShowButton('pro') && (
                <button
                  onClick={() => handlePlanAction('pro')}
                  className="btn-primary w-full py-2 px-4 rounded-md text-white font-medium transition-colors"
                >
                  {getButtonText('pro')}
                </button>
              )}
            </StripedBackground>

            {/* Premium Plan */}
            <StripedBackground className={`p-8 border relative ${
              user.membership === 'premium' ? 'border-2 border-purple-500' : 'border-border/50'
            }`}>
              {user.membership === 'premium' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  10000 credits
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Advanced AI agents
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  On-premise deployment
                </li>
                <li className="flex items-center text-gray-700">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Custom SLA
                </li>
              </ul>
              {shouldShowButton('premium') && (
                <button
                  onClick={() => handlePlanAction('premium')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  {getButtonText('premium')}
                </button>
              )}
            </StripedBackground>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
