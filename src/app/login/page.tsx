'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser, sendPasswordReset, signInWithGoogle, signInWithGitHub } from '@/actions/authActions'
import { setError } from '@/store/slices/authSlice'
import AnimatedSection from '@/components/AnimatedSection/AnimatedSection'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const dispatch = useAppDispatch()
  const { isLoading, error, user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(setError(null))
  }, [dispatch])

  useEffect(() => {
    if (user) {
      router.push('/account')
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const result = await dispatch(loginUser(formData.email, formData.password))

    if (result.success) {
      router.push('/account')
    } else if (result.needsVerification) {
      // User needs to verify email, redirect to verify-email page
      router.push(`/verify-email?email=${encodeURIComponent(result.email || formData.email)}`)
    }
  }

  const handleForgotPassword = async () => {
    // Validate email
    if (!resetEmail.trim()) {
      setResetMessage('Please enter your email address')
      return
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetMessage('Please enter a valid email address')
      return
    }

    setResetLoading(true)
    setResetMessage('')

    const result = await sendPasswordReset(resetEmail)

    setResetLoading(false)
    setResetMessage(result.message)

    if (result.success) {
      // Clear the email field and close modal after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false)
        setResetEmail('')
        setResetMessage('')
      }, 3000)
    }
  }

  const handleOpenForgotPassword = () => {
    setShowForgotPassword(true)
    setResetEmail(formData.email) // Pre-fill with login email if available
    setResetMessage('')
  }

  const handleGoogleLogin = async () => {
    const result = await dispatch(signInWithGoogle())
    if (result.success) {
      router.push('/account')
    }
  }

  const handleGitHubLogin = async () => {
    const result = await dispatch(signInWithGitHub())
    if (result.success) {
      router.push('/account')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AnimatedSection className="max-w-md w-full space-y-2">
        {/* Back Button */}
        <div>
          <div className="flex justify-start">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
          <div className="text-center">
            <h2 className="mt-1 text-3xl font-semi text-gray-900">
              Sign in
            </h2>
          </div>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                onClick={handleGitHubLogin}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800'
                  }`}
              >
                {isLoading ? 'Signing In...' : 'Continue'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleOpenForgotPassword}
                className="text-sm text-primary hover:text-primary/80"
              >
                Forgot your password?
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </AnimatedSection>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Reset Your Password
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div className="mb-4">
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>

              {resetMessage && (
                <div className={`mb-4 p-3 rounded-md ${resetMessage.includes('sent')
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
                  }`}>
                  <p className={`text-sm ${resetMessage.includes('sent')
                    ? 'text-green-600'
                    : 'text-red-600'
                    }`}>
                    {resetMessage}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetEmail('')
                    setResetMessage('')
                  }}
                  disabled={resetLoading}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
