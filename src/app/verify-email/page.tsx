'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resendEmailVerificationByEmail } from '@/actions/authActions'

export default function VerifyEmailPage() {
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)
  const [resendMessage, setResendMessage] = useState('')
  const [showPasswordField, setShowPasswordField] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get email from URL params (passed from signup or login)
  const email = searchParams.get('email') || ''

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
    return () => clearTimeout(timer)
  }, [countdown, canResend])

  const handleResendEmail = async () => {
    if (!canResend || isLoading) return

    if (!showPasswordField) {
      setShowPasswordField(true)
      return
    }

    if (!password.trim()) {
      setPasswordError('Password is required to resend verification email')
      return
    }

    setPasswordError('')
    const result = await dispatch(resendEmailVerificationByEmail(email, password))
    
    if (result.success) {
      setResendMessage('Verification email sent successfully!')
      setCanResend(false)
      setCountdown(60) // 60 second countdown
      setShowPasswordField(false)
      setPassword('')
      
      // Clear success message after 5 seconds
      setTimeout(() => setResendMessage(''), 5000)
    } else {
      setResendMessage(result.message || 'Failed to send verification email. Please try again.')
      setTimeout(() => setResendMessage(''), 5000)
    }
  }

  const handleCancelResend = () => {
    setShowPasswordField(false)
    setPassword('')
    setPasswordError('')
  }

  const handleGoToLogin = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/">
            <Image
              src="/images/continue-logo-light.png"
              alt="Continue"
              width={120}
              height={40}
              className="mx-auto h-12 w-auto"
            />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A verification link has been sent to your email address
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Email Address */}
            {email && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Verification email sent to:</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-left space-y-3">
              <p className="text-sm text-gray-600">
                Please check your email inbox and click the verification link to activate your account.
              </p>
              <p className="text-sm text-gray-600">
                Don't forget to check your spam or junk folder if you don't see the email in your inbox.
              </p>
            </div>

            {/* Success/Error Messages */}
            {resendMessage && (
              <div className={`p-3 rounded-md ${
                resendMessage.includes('successfully') 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  resendMessage.includes('successfully') 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {resendMessage}
                </p>
              </div>
            )}

            {/* Error from Redux */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Password Field (shown when resending) */}
            {showPasswordField && (
              <div className="space-y-4">
                <div className="text-left">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your password to resend verification email
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError('')
                    }}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleResendEmail}
                    disabled={isLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Email'}
                  </button>
                  <button
                    onClick={handleCancelResend}
                    disabled={isLoading}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Resend Button */}
            {!showPasswordField && (
              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={!canResend || isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    canResend && !isLoading
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!canResend ? (
                    `Resend in ${countdown}s`
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  You can request a new verification email every 60 seconds
                </p>
              </div>
            )}

            {/* Go to Login Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleGoToLogin}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login Page
              </button>
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                Still having trouble?{' '}
                <Link href="/get-in-touch" className="text-blue-600 hover:text-blue-500">
                  Contact Support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
