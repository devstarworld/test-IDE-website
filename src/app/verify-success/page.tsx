'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifySuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to account page after 3 seconds
    const timer = setTimeout(() => {
      router.push('/account')
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <div className="text-center">
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
                Your email has been successfully verified!
              </p>
              <p className="text-xs text-gray-500">
                Redirecting to your account in 3 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}