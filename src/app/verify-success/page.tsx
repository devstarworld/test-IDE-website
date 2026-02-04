'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function VerifySuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!auth) {
      setStatus('error')
      setMessage('Firebase Authentication is not available. Please try again later.')
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          setStatus('success')
          setMessage('Your email has been successfully verified! You can now log in to your account.')
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/login')
          }, 3000)
        } else {
          setStatus('error')
          setMessage('Your email is not yet verified. Please check your email and click the verification link.')
        }
      } else {
        setStatus('error')
        setMessage('No user found. Please try signing up again.')
      }
    })

    return () => unsubscribe()
  }, [router])

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
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="text-center">
            {status === 'loading' && (
              <div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Verifying your email...</p>
              </div>
            )}

            {status === 'success' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Email Verified Successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {message}
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Verification Failed
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {message}
                </p>
                <div className="space-y-3">
                  <Link
                    href="/signup"
                    className="w-full btn-primary text-white font-medium py-2 px-4 rounded-md inline-block"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/login"
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md inline-block"
                  >
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}