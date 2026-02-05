'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { checkAuthState, logoutUser } from '@/actions/authActions'
import PaymentModal from '@/components/PaymentModal/PaymentModal'

export default function AccountPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'premium'>('pro')

  useEffect(() => {
    dispatch(checkAuthState())
  }, [dispatch])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleLogout = async () => {
    await dispatch(logoutUser())
    router.push('/')
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <>
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        plan={selectedPlan}
        amount={getPlanAmount(selectedPlan)}
      />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Account</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                    {user.role}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Verification Status
                  </label>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.emailVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membership
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md capitalize">
                    {user.membership}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {new Date(user.memberSince).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Usage
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.creditUsage} credits
                  </p>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Actions</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Sign Out
                </button>

                {user.role === 'admin' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">
                      Admin Access
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      You have administrator privileges on this account.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded">
                      Admin Dashboard
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Plans Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Membership Plans</h2>
            <p className="text-gray-600 mt-2">Upgrade or change your membership plan</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className={`border rounded-lg p-6 ${
              user.membership === 'free' ? 'border-2 border-green-500 bg-green-50' : 'border-gray-200'
            }`}>
              {user.membership === 'free' && (
                <div className="mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  500 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Basic AI assistance
                </li>
              </ul>
              {user.membership !== 'free' && (
                <button
                  onClick={() => handlePlanAction('free')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Downgrade to Free
                </button>
              )}
            </div>

            {/* Pro Plan */}
            <div className={`border rounded-lg p-6 ${
              user.membership === 'pro' ? 'border-2 border-primary bg-blue-50' : 'border-gray-200'
            }`}>
              {user.membership === 'pro' && (
                <div className="mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1000 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Advanced AI agents
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Priority support
                </li>
              </ul>
              {user.membership !== 'pro' && (
                <button
                  onClick={() => handlePlanAction('pro')}
                  className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  {user.membership === 'free' ? 'Upgrade to Pro' : 'Downgrade to Pro'}
                </button>
              )}
            </div>

            {/* Premium Plan */}
            <div className={`border rounded-lg p-6 ${
              user.membership === 'premium' ? 'border-2 border-purple-500 bg-purple-50' : 'border-gray-200'
            }`}>
              {user.membership === 'premium' && (
                <div className="mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Current Plan
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">$99</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  10000 credits
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  On-premise deployment
                </li>
              </ul>
              {user.membership !== 'premium' && (
                <button
                  onClick={() => handlePlanAction('premium')}
                  className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}